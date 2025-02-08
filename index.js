const SMTPServer = require("smtp-server").SMTPServer;
//const nodemailer = require('nodemailer');
const creds = require('./creds.json');
const connectionString = creds.msauth.connectionString;
const simpleParser = require('mailparser').simpleParser;
const { EmailClient } = require("@azure/communication-email");
const server = new SMTPServer({
    name: 'CanonHome',
    authOptional : true,
    onConnect1: (session, callback)=>{ 
console.log('connect');
console.log(session);
    },
    onAuth: (auth, session, callback) => {
console.log('auth');
console.log(auth);
        callback(null, {
            user:'good'
        })
    },
    onMailFrom(address, session, callback) {
console.log('main from');
console.log(address);
        return callback(); // Accept the address
    },
    onRcptTo(address, session, callback) {
        if (!session.transporter) {
            session.transporter = new EmailClient(connectionString);
            session.message = {
                from: creds.from,
                // Comma separated list of recipients
    
                subject: new Date().toISOString()+' Scan from Canon',
                to: session.envelope.rcptTo.map(r=>r.address),
                //subject: 'Nodemailer is unicode friendly ✔',
                text: '',
                //html:'<p>testtt test gg',
            };
        }
        return callback();
    },
    onData(stream, session, callback) {
        //session.message.to =  session.envelope.rcptTo.map(r => r.address);
        stream.on('data', data => {
            //console.log(data);
            session.message.text += data.toString();
        })
        stream.on("end", async () => {
            const parsed = await simpleParser(session.message.text);
            const emailMessage = {
                senderAddress: creds.from,
                content: {
                    subject: session.message.subject,
                    plainText: session.message.subject,
                    html: `
			<html>
				<body>
					<h1>${session.message.subject}</h1>
				</body>
			</html>`,
                },
                recipients: {
                    to: session.envelope.rcptTo // [{ address: "gzhangx@hotmail.com" }],
                },
                attachments: parsed.attachments.map(f => {
                    return {
                        name: f.filename,
                        contentType: f.contentType,
                        contentInBase64: f.content.toString('base64')
                    }
                })
            };
            
            
            
            console.log('sending email', emailMessage );

            const poller = await session.transporter.beginSend(emailMessage);
            const result = await poller.pollUntilDone();
            console.log(result)
            callback();   
        });
      }
});

server.on("error", err => {
    console.log("Error %s", err.message);
  });

server.listen(1587)
