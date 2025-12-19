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
exports.NotificationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const notifications_service_1 = require("./notifications.service");
const dto_1 = require("./dto");
const common_1 = require("@nestjs/common");
const gql_guard_1 = require("../../auth/strategy/graphql/gql.guard");
let NotificationsResolver = class NotificationsResolver {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async notifications(receiverId, checked, offset, limit) {
        if (checked) {
            return {
                notifications: await this.notificationsService.getAllReadNotifications(receiverId, offset, limit),
                count: await this.notificationsService.getDocsCount({ receiver: receiverId, checked })
            };
        }
        else {
            return {
                notifications: await this.notificationsService.getAllUnreadNotifications(receiverId, offset, limit),
                count: await this.notificationsService.getDocsCount({ receiver: receiverId, checked })
            };
        }
    }
    async notificationsByIds(ids) {
        return await this.notificationsService.getAllNotificationsByIds(ids);
    }
    async notificationCreate(dto) {
        return await this.notificationsService.createNotification(dto);
    }
    async notificationDeleteById(_id) {
        return await this.notificationsService.deleteNotificationById(_id);
    }
    async notificationsDeleteByIds(ids) {
        const data = await this.notificationsService.deleteNotificationsByIds(ids);
        return { count: data.deletedCount };
    }
    async notificationMarkAsReadById(_id) {
        return await this.notificationsService.markNotificationAsRead(_id);
    }
    async notificationsMarkAsReadByIds(ids) {
        const data = await this.notificationsService.markNotificationsAsRead(ids);
        return { count: data.modifiedCount };
    }
};
exports.NotificationsResolver = NotificationsResolver;
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('receiverId')),
    __param(1, (0, graphql_1.Args)('checked')),
    __param(2, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(3, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "notifications", null);
__decorate([
    (0, graphql_1.Query)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "notificationsByIds", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "notificationCreate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "notificationDeleteById", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "notificationsDeleteByIds", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "notificationMarkAsReadById", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], NotificationsResolver.prototype, "notificationsMarkAsReadByIds", null);
exports.NotificationsResolver = NotificationsResolver = __decorate([
    (0, graphql_1.Resolver)('Notification'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsResolver);
//# sourceMappingURL=notifications.resolver.js.map