import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
export declare class EmailService {
    private nodemailerService;
    private configService;
    constructor(nodemailerService: MailerService, configService: ConfigService);
    sendVerificationEmail(to: string, userName: string, link: string, passcode: string): Promise<void>;
    sendRestorationEmail(to: string, userName: string, linkRestore: string): Promise<void>;
    sendInformationEmail(to: string, userName: string, text: string): Promise<void>;
    sendEmailLinkingEmail(to: string, userName: string, linkLink: string): Promise<void>;
}
