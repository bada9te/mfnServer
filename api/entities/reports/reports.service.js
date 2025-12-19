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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const reports_schema_1 = require("./reports.schema");
const mongoose_2 = require("mongoose");
const posts_service_1 = require("../posts/posts.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ReportsService = class ReportsService {
    constructor(reportsModel, postsService, notificationsService) {
        this.reportsModel = reportsModel;
        this.postsService = postsService;
        this.notificationsService = notificationsService;
    }
    async createReport(report) {
        const inserted = await this.reportsModel.create(report);
        if (report.reportedPost && !report.email) {
            const post = await this.postsService.getPostById(report.reportedPost);
            if (post) {
                await this.notificationsService.createNotification({
                    receiver: post.owner._id.toString(),
                    post: report.reportedPost,
                    text: report.message,
                    type: "POST_REPORTED",
                });
            }
        }
        return inserted;
    }
    async getAllReports(range) {
        return await this.reportsModel.find()
            .skip(range.offset)
            .limit(range.limit);
    }
    async closeReport(_id) {
        return await this.reportsModel.findByIdAndUpdate(_id, { isClosed: true }, { new: true, upsert: true });
    }
    async getReportById(_id) {
        return await this.reportsModel.findById(_id);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(reports_schema_1.Report.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        posts_service_1.PostsService,
        notifications_service_1.NotificationsService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map