


const nodemailer = require('nodemailer');

            const transporter = nodemailer.createTransport({
                
                host: '192.168.0.40',
                secure: false,
                port: 1587,
                auth: { user: 'scan', pass: 'scan' },
                tls: { rejectUnauthorized: false }
            });
            const message = {
                from: 'scan@localhost',
                // Comma separated list of recipients

                subject: new Date().toISOString() + ' Scan from Canon',
                to: 'gzhangx@hotmail.com',
                
                text: 'test',
                //attachments: [
                    //{
                        //filename: 'image1.jpeg',
                        //path: __dirname + '/image1.jpeg'
                    //}
                //]
            };        
    
        
        
            
            
            transporter.sendMail(message).then(res => {
                console.log(res);
            }).catch(err => console.log(err));
            
            /*
const { EmailClient } = require("@azure/communication-email");
const creds = require('./creds.json');
const connectionString = creds.msauth.connectionString;
const client = new EmailClient(connectionString);

async function main() {
    const emailMessage = {
        senderAddress: creds.from,
        content: {
            subject: "Test Email",
            plainText: "Hello world via email.",
            html: `
			<html>
				<body>
					<h1>Hello world via email my test.aaa</h1>
				</body>
			</html>`,
        },
        recipients: {
            to: [{ address: "gzhangx@hotmail.com" }],
        }        
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    console.log(result)
}
*/
