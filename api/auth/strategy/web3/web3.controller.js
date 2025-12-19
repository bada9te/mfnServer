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
exports.Web3OauthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../jwt/jwt.service");
const web3_guard_1 = require("./web3.guard");
const config_1 = require("@nestjs/config");
let Web3OauthController = class Web3OauthController {
    constructor(jwtAuthService, configService) {
        this.jwtAuthService = jwtAuthService;
        this.configService = configService;
    }
    async web3Auth(req, res) {
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
exports.Web3OauthController = Web3OauthController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(web3_guard_1.Web3OauthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Web3OauthController.prototype, "web3Auth", null);
exports.Web3OauthController = Web3OauthController = __decorate([
    (0, common_1.Controller)('auth/web3'),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService,
        config_1.ConfigService])
], Web3OauthController);
//# sourceMappingURL=web3.controller.js.map