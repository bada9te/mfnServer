import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import ejs from "ejs";


@Injectable()
export class EmailService {
    constructor(
        private nodemailerService: MailerService,
        private configService: ConfigService,
    ) {}

    async sendVerificationEmail(to: string, userName: string, link: string, passcode: string) {
        this.nodemailerService.sendMail({
            to,
            from: "MFN",
            subject: `Account verification`,
            template: "./verificationTemplate",
            context: {
                link, 
                userName, 
                passcode,
            },
        }).then(console.log).catch(console.log);

    }

    async sendRestorationEmail(to: string, userName: string, linkRestore: string) {
        this.nodemailerService.sendMail({
            to,
            from: "MFN",
            subject: 'Account restoring',
            template: join(__dirname, 'templates', 'restorationTemplate'),
            context: {
                userName,
                link: linkRestore,
            },
        }).then(console.log).catch(console.log);
    }

    async sendInformationEmail(to: string, userName: string, text: string) {
        this.nodemailerService.sendMail({
            to,
            from: "MFN",
            subject: 'Account info',
            template: join(__dirname, 'templates', 'informationTemplate'),
            context: {
                userName, 
                text,
            },
        }).then(console.log).catch(console.log);
    }

    async sendEmailLinkingEmail(to: string, userName: string, linkLink: string) {
        this.nodemailerService.sendMail({
            to,
            from: "MFN",
            subject: 'Email linking',
            template: join(__dirname, 'templates', 'linkEmailTemplate'),
            context: {
                userName,
                link: linkLink,
            },
        }).then(console.log).catch(console.log);
    }
}