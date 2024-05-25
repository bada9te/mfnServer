import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

@Injectable()
export class EmailService {
    constructor(
        private nodemailerService: MailerService,
        private configService: ConfigService,
    ) {}

    async sendVerificationEmail(to: string, userName: string, link: string, passcode: string) {
        console.log(to, userName)
        this.nodemailerService.sendMail({
            to,
            from: this.configService.get("EMAIL_USERNAME"),
            subject: `Account verification`,
            template: join(__dirname, 'templates', 'verificationTemplate'),
            context: {
                link, 
                userName, 
                passcode,
            },
        }).then(console.log);
    }

    async sendRestorationEmail(to: string, userName: string, linkRestore: string) {
        this.nodemailerService.sendMail({
            to,
            subject: 'Account restoring',
            template: join(__dirname, 'templates', 'restorationTemplate'),
            context: {
                userName,
                linkRestore,
            },
        });
    }

    async sendInformationEmail(to: string, userName: string, text: string) {
        this.nodemailerService.sendMail({
            to,
            subject: 'Account info',
            template: join(__dirname, 'templates', 'informationTemplate'),
            context: {
                userName, 
                text,
            },
        });
    }

    // chnage email
    async sendChangingEmail(to: string, userName: string, newEmail: string, link: string, passcode: string) {
        this.nodemailerService.sendMail({
            to,
            subject: 'Email changing',
            template: join(__dirname, 'templates', 'informationTemplate'),
            context: {
                userName, 
                link,
                passcode,
                newEmail,
            },
        });
    }
}