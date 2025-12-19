"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterOauthModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../../../entities/users/users.module");
const jwt_module_1 = require("../jwt/jwt.module");
const twitter_controller_1 = require("./twitter.controller");
const twitter_strategy_1 = require("./twitter.strategy");
let TwitterOauthModule = class TwitterOauthModule {
};
exports.TwitterOauthModule = TwitterOauthModule;
exports.TwitterOauthModule = TwitterOauthModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, jwt_module_1.JwtAuthModule],
        controllers: [twitter_controller_1.TwitterOauthController],
        providers: [twitter_strategy_1.TwitterOauthStrategy],
    })
], TwitterOauthModule);
//# sourceMappingURL=twitter.module.js.map