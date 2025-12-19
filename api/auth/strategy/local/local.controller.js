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
exports.LocalOauthController = void 0;
const common_1 = require("@nestjs/common");
const local_guard_1 = require("./local.guard");
const jwt_service_1 = require("../jwt/jwt.service");
const config_1 = require("@nestjs/config");
let LocalOauthController = class LocalOauthController {
    constructor(jwtAuthService, configService) {
        this.jwtAuthService = jwtAuthService;
        this.configService = configService;
    }
    async localAuth(req, res) {
        const { userId, accessToken } = await this.jwtAuthService.login(req.user);
        res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            sameSite: 'none',
            secure: true,
        });
        res.cookie(this.configService.get('USER_ID_COOKIE_KEY'), userId, {
            sameSite: 'none',
            secure: true,
        });
        return res.redirect('me');
    }
};
exports.LocalOauthController = LocalOauthController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(local_guard_1.LocalOauthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocalOauthController.prototype, "localAuth", null);
exports.LocalOauthController = LocalOauthController = __decorate([
    (0, common_1.Controller)('auth/local'),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService,
        config_1.ConfigService])
], LocalOauthController);
//# sourceMappingURL=local.controller.js.map