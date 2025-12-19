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
exports.BattlesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const battles_service_1 = require("./battles.service");
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const gql_guard_1 = require("../../auth/strategy/graphql/gql.guard");
let BattlesResolver = class BattlesResolver {
    constructor(battlesService) {
        this.battlesService = battlesService;
    }
    async battlesByStatus(finished, offset, limit) {
        return {
            battles: await this.battlesService.getAllBattlesByStatus(finished, { offset, limit }),
            count: await this.battlesService.getDocsCount({ finished }),
        };
    }
    async battleById(_id) {
        return await this.battlesService.getBattleById(_id);
    }
    async battlesUserParticipatedIn(userId, offset, limit) {
        return {
            battles: await this.battlesService.getBattlesUserParticipatedIn(userId, { offset, limit }),
            count: await this.battlesService.getDocsCount({ $or: [{ initiator: userId }, { votedBy: userId }] })
        };
    }
    async battleCreate(dto) {
        return await this.battlesService.addBattleByIds(dto);
    }
    async battleDeleteById(_id) {
        return await this.battlesService.deleteBattle(_id);
    }
    async battleMakeVote(dto) {
        return await this.battlesService.updateScore(dto);
    }
};
exports.BattlesResolver = BattlesResolver;
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('finished', common_1.ParseBoolPipe)),
    __param(1, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(2, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], BattlesResolver.prototype, "battlesByStatus", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BattlesResolver.prototype, "battleById", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('userId')),
    __param(1, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(2, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], BattlesResolver.prototype, "battlesUserParticipatedIn", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBattleDto]),
    __metadata("design:returntype", Promise)
], BattlesResolver.prototype, "battleCreate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BattlesResolver.prototype, "battleDeleteById", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.MakeBattleVoteDto]),
    __metadata("design:returntype", Promise)
], BattlesResolver.prototype, "battleMakeVote", null);
exports.BattlesResolver = BattlesResolver = __decorate([
    (0, graphql_1.Resolver)('Battle'),
    __metadata("design:paramtypes", [battles_service_1.BattlesService])
], BattlesResolver);
//# sourceMappingURL=battles.resolver.js.map