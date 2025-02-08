
const nodemailer = require('nodemailer');
const creds = require('./creds.json');

            const transporter = nodemailer.createTransport({
                service: 'postfix',
                host: 'localhost',
                secure: false,
                port: 25,
                auth: { user: 'scan', pass: 'scan' },
                tls: { rejectUnauthorized: false }
            });
            const message = {
                from: creds.from,
                // Comma separated list of recipients

                subject: new Date().toISOString() + ' Scan from Canon',
                to: 'scan@localhost',
                
                text: 'test',
            };        
    
        
        
            
            
            transporter.sendMail(message).then(res => {
                console.log(res);
            }).catch(err => console.log(err));
            
