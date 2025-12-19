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
exports.Web3OauthStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_dapp_web3_1 = require("passport-dapp-web3");
const jwt_service_1 = require("../jwt/jwt.service");
const config_1 = require("@nestjs/config");
let Web3OauthStrategy = class Web3OauthStrategy extends (0, passport_1.PassportStrategy)(passport_dapp_web3_1.Strategy, 'web3') {
    constructor(jwtAuthService, configService) {
        super({
            addressField: 'address',
            messageField: 'message',
            signedField: 'signed',
            session: false
        });
        this.jwtAuthService = jwtAuthService;
        this.configService = configService;
    }
    async validate(address, message, signed, done) {
        let user;
        user = await this.jwtAuthService.processWeb3(address, message, signed);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        done(null, user);
    }
};
exports.Web3OauthStrategy = Web3OauthStrategy;
exports.Web3OauthStrategy = Web3OauthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService, config_1.ConfigService])
], Web3OauthStrategy);
//# sourceMappingURL=web3.strategy.js.map