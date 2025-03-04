


const nodemailer = require('nodemailer');
const fs = require('fs');

function testsmtp() {
    const creds = JSON.parse(fs.readFileSync('./creds.json'))
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: creds.google.user,
            pass: creds.google.pass,
        },
    });
    const message = {
        from: creds.google.user,
        // Comma separated list of recipients        
        to: creds.testTo,
        subject: "Hello from Nodemailer " + new Date().toISOString(),
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
}

testsmtp();


function testLocal() {
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
        to: creds.testTo,
                
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
}
    
        
 
function testAzure() {
    const { EmailClient } = require("@azure/communication-email");
    const creds = require('./creds.json');
    const connectionString = creds.msauth.connectionString;
    const client = new EmailClient(connectionString);

    const user = creds.msauth.user;
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
                to: [{ address: user }],
            }
        };

        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        console.log(result)
    }

    main();

}

