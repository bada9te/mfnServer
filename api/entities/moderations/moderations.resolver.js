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
exports.ModerationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const moderations_service_1 = require("./moderations.service");
const dto_1 = require("./dto");
let ModerationsResolver = class ModerationsResolver {
    constructor(moderationsService) {
        this.moderationsService = moderationsService;
    }
    async moderationActionValidate(input) {
        return await this.moderationsService.validateAction(input);
    }
    async moderationActionCreate(input) {
        return await this.moderationsService.createModeration(input);
    }
    async moderationActionDelete(input) {
        return await this.moderationsService.deleteModeration(input);
    }
};
exports.ModerationsResolver = ModerationsResolver;
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ModerationDto]),
    __metadata("design:returntype", Promise)
], ModerationsResolver.prototype, "moderationActionValidate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateModerationDto]),
    __metadata("design:returntype", Promise)
], ModerationsResolver.prototype, "moderationActionCreate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ModerationDto]),
    __metadata("design:returntype", Promise)
], ModerationsResolver.prototype, "moderationActionDelete", null);
exports.ModerationsResolver = ModerationsResolver = __decorate([
    (0, graphql_1.Resolver)('Moderation'),
    __metadata("design:paramtypes", [moderations_service_1.ModerationsService])
], ModerationsResolver);
//# sourceMappingURL=moderations.resolver.js.map