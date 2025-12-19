"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("./auth.controller");
const users_module_1 = require("../entities/users/users.module");
const google_module_1 = require("./strategy/google/google.module");
const jwt_module_1 = require("./strategy/jwt/jwt.module");
const facebook_module_1 = require("./strategy/facebook/facebook.module");
const twitter_module_1 = require("./strategy/twitter/twitter.module");
const local_module_1 = require("./strategy/local/local.module");
const notifications_module_1 = require("../entities/notifications/notifications.module");
const web3_module_1 = require("./strategy/web3/web3.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_module_1.JwtAuthModule,
            local_module_1.LocalOauthModule,
            google_module_1.GoogleOauthModule,
            facebook_module_1.FacebookOauthModule,
            twitter_module_1.TwitterOauthModule,
            notifications_module_1.NotificationsModule,
            web3_module_1.Web3OauthModule,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map