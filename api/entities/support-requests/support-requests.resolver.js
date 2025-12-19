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
exports.SupportRequestsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const support_requests_service_1 = require("./support-requests.service");
const dto_1 = require("./dto");
const common_1 = require("@nestjs/common");
const gql_guard_1 = require("../../auth/strategy/graphql/gql.guard");
let SupportRequestsResolver = class SupportRequestsResolver {
    constructor(supportRequestsService) {
        this.supportRequestsService = supportRequestsService;
    }
    async supportRequests(offset, limit) {
        return await this.supportRequestsService.getAllSupportRequsts({ offset, limit });
    }
    async supportRequest(_id) {
        return await this.supportRequestsService.getSupportRequestById(_id);
    }
    async supportRequestCreate(dto) {
        return await this.supportRequestsService.createSupportRequest(dto);
    }
    async supportRequestClose(_id) {
        return await this.supportRequestsService.closeSupportRequest(_id);
    }
};
exports.SupportRequestsResolver = SupportRequestsResolver;
__decorate([
    (0, graphql_1.Query)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(1, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SupportRequestsResolver.prototype, "supportRequests", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportRequestsResolver.prototype, "supportRequest", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSupportRequestDto]),
    __metadata("design:returntype", Promise)
], SupportRequestsResolver.prototype, "supportRequestCreate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupportRequestsResolver.prototype, "supportRequestClose", null);
exports.SupportRequestsResolver = SupportRequestsResolver = __decorate([
    (0, graphql_1.Resolver)('SuuportRequest'),
    __metadata("design:paramtypes", [support_requests_service_1.SupportRequestsService])
], SupportRequestsResolver);
//# sourceMappingURL=support-requests.resolver.js.map