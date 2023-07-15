const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars')

// our email
const email = 'musicfromnothing@outlook.com';

// teamplates path
const htmlTeamplatesPATH = path.join(__dirname, 'htmlTemplates');

// transporter
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'musicfromnothing@outlook.com',
        pass: 'hoRX54+#',
    },
});

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve(htmlTeamplatesPATH),
        defaultLayout: false,
    },
    viewPath: path.resolve(htmlTeamplatesPATH),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))


// send verify email
const sendVerifyEmail = (to, userName, link, passcode) => {
    transporter.sendMail({
        from: email,
        to,
        subject: '[MFN] Account verification',
        template: 'verify',
        context: {
            userName, 
            link,
            passcode,
        },
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email send:', info.response);
        }
    });
}

// const send restore email
const sendRestoreEmail = (to, userName, linkRestore) => {
    transporter.sendMail({
        from: email,
        to,
        subject: '[MFN] Account restoring',
        template: 'restore',
        context: {
            userName, 
            linkRestore,
        },
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email send:', info.response);
        }
    });
}


// info email
const sendInfoEmail = (to, userName, text) => {
    transporter.sendMail({
        from: email,
        to,
        subject: '[MFN] Account info',
        template: 'info',
        context: {
            userName, 
            text,
        },
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email send:', info.response);
        }
    });
}


// chnage email
const sendChangeEmail = (to, userName, newEmail, link, passcode) => {
    transporter.sendMail({
        from: email,
        to,
        subject: '[MFN] Email changing',
        template: 'emailChange',
        context: {
            userName, 
            text,
            link,
            passcode,
        },
    }, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email send:', info.response);
        }
    });
}



module.exports = {
    sendVerifyEmail,
    sendRestoreEmail,
    sendInfoEmail,
    sendChangeEmail,
};