import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars/index';

// our email
const email = 'musicfromnothing@outlook.com';

// teamplates path
const htmlTeamplatesPATH = path.join(__dirname, 'htmlTemplates');

// transporter
const transporter: hbs.HbsTransporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'musicfromnothing@outlook.com',
        pass: 'hoRX54+#',
    },
});

// point to the template folder
const handlebarOptions: hbs.NodemailerExpressHandlebarsOptions = {
    viewEngine: {
        partialsDir: path.resolve(htmlTeamplatesPATH),
        defaultLayout: false,
    },
    viewPath: path.resolve(htmlTeamplatesPATH),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions));

const catchErrCallback = (err: Error, info: nodemailer.SentMessageInfo): void => {
    if (err) {
        console.log(err);
    } else {
        console.log('Email was sent:', info.response);
    }
}


// send verify email
const sendVerifyEmail = (to: string, userName: string, link: string, passcode: string): void => {
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
    }, catchErrCallback);
}

// const send restore email
const sendRestoreEmail = (to: string, userName: string, linkRestore: string): void => {
    transporter.sendMail({
        from: email,
        to,
        subject: '[MFN] Account restoring',
        template: 'restore',
        
        context: {
            userName, 
            linkRestore,
        },
    }, catchErrCallback);
}


// info email
const sendInfoEmail = (to: string, userName: string, text: string): void => {
    transporter.sendMail({
        from: email,
        to,
        subject: '[MFN] Account info',
        template: 'info',
        context: {
            userName, 
            text,
        },
    }, catchErrCallback);
}


// chnage email
const sendChangeEmail = (to: string, userName: string, newEmail: string, link: string, passcode: string): void => {
    transporter.sendMail({
        from: email,
        to,
        subject: '[MFN] Email changing',
        template: 'emailChange',
        context: {
            userName, 
            link,
            passcode,
        },
    }, catchErrCallback);
}


sendVerifyEmail("wotgamer257@gmail.com", "testUSER", "www.google.com", "passcodeEXAMPLE");


export {
    sendVerifyEmail,
    sendRestoreEmail,
    sendInfoEmail,
    sendChangeEmail,
};