"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
let EmailService = class EmailService {
    constructor(nodemailerService, configService) {
        this.nodemailerService = nodemailerService;
        this.configService = configService;
    }
    async sendVerificationEmail(to, userName, link, passcode) {
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
    async sendRestorationEmail(to, userName, linkRestore) {
        this.nodemailerService.sendMail({
            to,
            from: "MFN",
            subject: 'Account restoring',
            template: (0, path_1.join)(__dirname, 'templates', 'restorationTemplate'),
            context: {
                userName,
                link: linkRestore,
            },
        }).then(console.log).catch(console.log);
    }
    async sendInformationEmail(to, userName, text) {
        this.nodemailerService.sendMail({
            to,
            from: "MFN",
            subject: 'Account info',
            template: (0, path_1.join)(__dirname, 'templates', 'informationTemplate'),
            context: {
                userName,
                text,
            },
        }).then(console.log).catch(console.log);
    }
    async sendEmailLinkingEmail(to, userName, linkLink) {
        this.nodemailerService.sendMail({
            to,
            from: "MFN",
            subject: 'Email linking',
            template: (0, path_1.join)(__dirname, 'templates', 'linkEmailTemplate'),
            context: {
                userName,
                link: linkLink,
            },
        }).then(console.log).catch(console.log);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map