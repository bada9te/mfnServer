"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const mongoose_1 = require("@nestjs/mongoose");
const reports_schema_1 = require("./reports.schema");
const reports_resolver_1 = require("./reports.resolver");
const notifications_module_1 = require("../notifications/notifications.module");
const posts_module_1 = require("../posts/posts.module");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notifications_module_1.NotificationsModule,
            posts_module_1.PostsModule,
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: reports_schema_1.Report.name,
                    useFactory: () => {
                        const schema = reports_schema_1.ReportSchema;
                        schema.plugin(require("mongoose-autopopulate"));
                        return schema;
                    }
                }
            ])
        ],
        providers: [reports_service_1.ReportsService, reports_resolver_1.ReportsResolver],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map