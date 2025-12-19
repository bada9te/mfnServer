"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3OauthModule = void 0;
const common_1 = require("@nestjs/common");
const web3_strategy_1 = require("./web3.strategy");
const users_module_1 = require("../../../entities/users/users.module");
const jwt_module_1 = require("../jwt/jwt.module");
const web3_controller_1 = require("./web3.controller");
let Web3OauthModule = class Web3OauthModule {
};
exports.Web3OauthModule = Web3OauthModule;
exports.Web3OauthModule = Web3OauthModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, jwt_module_1.JwtAuthModule],
        controllers: [web3_controller_1.Web3OauthController],
        providers: [web3_strategy_1.Web3OauthStrategy],
    })
], Web3OauthModule);
//# sourceMappingURL=web3.module.js.map