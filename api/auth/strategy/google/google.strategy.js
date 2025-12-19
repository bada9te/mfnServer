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
exports.GoogleOauthStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth_1 = require("passport-google-oauth");
const jwt_service_1 = require("../jwt/jwt.service");
const users_service_1 = require("../../../entities/users/users.service");
let GoogleOauthStrategy = class GoogleOauthStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth_1.OAuth2Strategy, 'google') {
    constructor(configService, jwtAuthService, usersService) {
        super({
            clientID: configService.get('PASSPORT_GOOGLE_ID'),
            clientSecret: configService.get('PASSPORT_GOOGLE_SECRET'),
            callbackURL: configService.get('PASSPORT_GOOGLE_CALLBACK'),
            passReqToCallback: true,
            scope: ['profile', 'email']
        });
        this.configService = configService;
        this.jwtAuthService = jwtAuthService;
        this.usersService = usersService;
    }
    async validate(_req, _accessToken, _refreshToken, profile, done) {
        const currentUserJwt = _req.cookies[this.configService.get('SESSION_COOKIE_KEY')];
        const currentUserId = _req.cookies[this.configService.get('USER_ID_COOKIE_KEY')];
        let user = await this.usersService.getUserById(currentUserId);
        let processedUser;
        if (currentUserId && currentUserJwt) {
            user = await this.jwtAuthService.processGoogle(profile, _accessToken, currentUserId);
        }
        else {
            user = await this.jwtAuthService.processGoogle(profile, _accessToken);
        }
        if (processedUser) {
            user = processedUser;
        }
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        done(null, user);
    }
};
exports.GoogleOauthStrategy = GoogleOauthStrategy;
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object, Function]),
    __metadata("design:returntype", Promise)
], GoogleOauthStrategy.prototype, "validate", null);
exports.GoogleOauthStrategy = GoogleOauthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, jwt_service_1.JwtAuthService, users_service_1.UsersService])
], GoogleOauthStrategy);
//# sourceMappingURL=google.strategy.js.map