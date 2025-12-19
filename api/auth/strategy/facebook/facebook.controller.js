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
exports.FacebookOauthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../jwt/jwt.service");
const config_1 = require("@nestjs/config");
const facebook_guard_1 = require("./facebook.guard");
let FacebookOauthController = class FacebookOauthController {
    constructor(jwtAuthService, configService) {
        this.jwtAuthService = jwtAuthService;
        this.configService = configService;
    }
    async facebookAuth(_req) {
    }
    async facebookAuthRedirect(req, res) {
        const { accessToken, userId } = await this.jwtAuthService.login(req.user);
        res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            sameSite: 'none',
            secure: true,
        });
        res.cookie(this.configService.get('USER_ID_COOKIE_KEY'), userId, {
            sameSite: 'none',
            secure: true,
        });
        return res.redirect(this.configService.get('CLIENT_BASE'));
    }
};
exports.FacebookOauthController = FacebookOauthController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(facebook_guard_1.FacebookOauthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FacebookOauthController.prototype, "facebookAuth", null);
__decorate([
    (0, common_1.Get)('callback'),
    (0, common_1.UseGuards)(facebook_guard_1.FacebookOauthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FacebookOauthController.prototype, "facebookAuthRedirect", null);
exports.FacebookOauthController = FacebookOauthController = __decorate([
    (0, common_1.Controller)('auth/facebook'),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService,
        config_1.ConfigService])
], FacebookOauthController);
//# sourceMappingURL=facebook.controller.js.map