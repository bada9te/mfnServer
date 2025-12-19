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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalOauthStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_local_1 = require("passport-local");
const jwt_service_1 = require("../jwt/jwt.service");
let LocalOauthStrategy = class LocalOauthStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy, 'local') {
    constructor(jwtAuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        });
        this.jwtAuthService = jwtAuthService;
    }
    async validate(_req, email, password) {
        const user = await this.jwtAuthService.processLocal(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.LocalOauthStrategy = LocalOauthStrategy;
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LocalOauthStrategy.prototype, "validate", null);
exports.LocalOauthStrategy = LocalOauthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService])
], LocalOauthStrategy);
//# sourceMappingURL=local.strategy.js.map