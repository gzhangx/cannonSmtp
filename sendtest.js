const net = require('net');


const creds = require('./creds.json');

const socket = net.connect({ port: 1587, host: creds.smtpServer }, () => {
    console.log('connected');
    const smtp = getSmtpSender('test', 'test', (str) => socket.write(str), socket);
    socket.on('data', data => {
        smtp(data.toString());
    })
    socket.on('close', () => {
        console.log('closed');
    })
});

function getCrlfParser(onData) {
    let lastSeg = '';

    return data => {
        data = data.toString();
        while (true) {
            const ind = data.indexOf('\n');
            if (ind < 0) {
                lastSeg += data;
                break;
            }
            lastSeg += data.substring(0, ind);
            onData(lastSeg);
            lastSeg = '';
            data = data.substring(ind+1)
        }
    }
}



function getSmtpSender(subject, text, writer, socket) {
    let state = 'init'
    const onSmtpData = line => {
        console.log(` state=${state} line=${line}`);
        switch (state) {
            case 'init':
                writer('HELO host.localhost\r\n');
                state = 'from 250'; //
                break;
            case 'from 250':
                writer('MAIL from: <'+ creds.google.user+ '>\r\n');
                state = 'to 250'
                break;
            case 'to 250':
                writer('rcpt to: <' + creds.testTo + '>\r\n');
                state = 'data'
                break;
            case 'data':
                writer('data\r\n');
                state = 'enterData';
                break;
            case 'enterData':
                writer('Date: Wed, 19 Feb 2025 12:13:19 -0500\r\n' +
        'From: '+ creds.google.user+ '\r\n' +
                    'To: "Somone" <' + creds.testTo +'>\r\n' +
        'Subject: Attached Image\r\n' +
        'MIME-Version: 1.0\r\n' +
        'X-Priority: 3\r\n' +
        'X-Mailer: Canon MFP\r\n' +
        'Message-ID: <20250219121319.0001.CanonTxNo.0485@hsd1.ga.comcast.net.>\r\n' +
        'Content-Type: multipart/mixed; boundary="----_CANON_2502191213190485_"\r\n' +
        'Content-Transfer-Encoding: quoted-printable\r\n' +
        '\r\n' +
        '------_CANON_2502191213190485_\r\n' +
        'Content-Type: text/plain;\r\n' +
        ' name="0485_250219121319_001.pdf"\r\n' +
        'Content-Disposition: attachment;\r\n' +
        ' filename="0485_250219121319_001.txt"\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
                    '\r\n' +
                    'somesome\r\n------_CANON_2502191213190485_--\r\n.\r\n'
                )
                state='end'
                break;
            case 'end':
                socket.destroy();
                break;
        }
    }
    return getCrlfParser(onSmtpData);
}