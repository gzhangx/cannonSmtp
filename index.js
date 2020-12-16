const SMTPServer = require("smtp-server").SMTPServer;
const nodemailer = require('nodemailer');
const creds = require('./creds.json');


const server = new SMTPServer({
    name: 'CanonHome',
    authOptional : true,
    onAuth: (auth, session, callback) => {
        callback(null, {
            user:'good'
        })
    },
    onMailFrom(address, session, callback) {
        return callback(); // Accept the address
    },
    onRcptTo(address, session, callback) {
        if (!session.transporter) {
            session.transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                secureConnection: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                tls: {
                    ciphers: 'SSLv3'
                },
                auth: creds.msauth
            });
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
        session.message.to = session.envelope.rcptTo.map(r => r.address);
        stream.on('data', data => {
            //console.log(data);
            session.message.text += data.toString();
        })
        stream.on("end", () => {
            session.message.attachments = [{
                raw: session.message.text,
            }];
            session.message.text = '';
            session.transporter.sendMail(session.message).then(res=>{
                console.log(res);
                 }).catch(err=>console.log(err));
            callback();   
        });
      }
});

server.on("error", err => {
    console.log("Error %s", err.message);
  });

server.listen(1587)