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
exports.TwitterOauthStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const jwt_service_1 = require("../jwt/jwt.service");
const passport_twitter_oauth2_1 = require("@superfaceai/passport-twitter-oauth2");
const users_service_1 = require("../../../entities/users/users.service");
let TwitterOauthStrategy = class TwitterOauthStrategy extends (0, passport_1.PassportStrategy)(passport_twitter_oauth2_1.Strategy, 'twitter') {
    constructor(configService, jwtAuthService, usersService) {
        super({
            clientType: 'confidential',
            clientID: configService.get('PASSPORT_TWITTER_KEY'),
            clientSecret: configService.get('PASSPORT_TWITTER_SECRET'),
            callbackURL: configService.get('PASSPORT_TWITTER_CALLBACK'),
            scope: ['tweet.read', 'tweet.write', 'users.read'],
            passReqToCallback: true,
        });
        this.configService = configService;
        this.jwtAuthService = jwtAuthService;
        this.usersService = usersService;
    }
    async validate(_req, token, tokenSecret, profile) {
        const currentUserJwt = _req.cookies[this.configService.get('SESSION_COOKIE_KEY')];
        const currentUserId = _req.cookies[this.configService.get('USER_ID_COOKIE_KEY')];
        let user = await this.usersService.getUserById(currentUserId);
        let processedUser;
        if (currentUserId && currentUserJwt) {
            processedUser = await this.jwtAuthService.processTwitter(profile, token, currentUserId);
        }
        else {
            processedUser = await this.jwtAuthService.processTwitter(profile, token);
        }
        if (processedUser) {
            user = processedUser;
        }
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.TwitterOauthStrategy = TwitterOauthStrategy;
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], TwitterOauthStrategy.prototype, "validate", null);
exports.TwitterOauthStrategy = TwitterOauthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, jwt_service_1.JwtAuthService, users_service_1.UsersService])
], TwitterOauthStrategy);
//# sourceMappingURL=twitter.strategy.js.map