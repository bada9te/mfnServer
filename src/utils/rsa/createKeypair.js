const fs = require('fs');
const path = require('path');
const crypto = require('crypto');


const generateKeyPair = () => {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    fs.writeFileSync(path.join(__dirname, '/id_rsa_pub.pem'), keyPair.publicKey);
    fs.writeFileSync(path.join(__dirname, '/id_rsa_pri.pem'), keyPair.privateKey);
}

generateKeyPair();
