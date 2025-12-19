"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattlesModule = void 0;
const common_1 = require("@nestjs/common");
const battles_service_1 = require("./battles.service");
const mongoose_1 = require("@nestjs/mongoose");
const battles_schema_1 = require("./battles.schema");
const battles_resolver_1 = require("./battles.resolver");
const tasks_module_1 = require("../../utils/tasks/tasks.module");
const notifications_module_1 = require("../notifications/notifications.module");
const posts_module_1 = require("../posts/posts.module");
let BattlesModule = class BattlesModule {
};
exports.BattlesModule = BattlesModule;
exports.BattlesModule = BattlesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            tasks_module_1.TasksModule,
            notifications_module_1.NotificationsModule,
            posts_module_1.PostsModule,
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: battles_schema_1.Battle.name,
                    useFactory: () => {
                        const schema = battles_schema_1.BattleSchema;
                        schema.plugin(require("mongoose-autopopulate"));
                        return schema;
                    }
                }
            ]),
        ],
        providers: [battles_service_1.BattlesService, battles_resolver_1.BattlesResolver],
        exports: [battles_service_1.BattlesService],
    })
], BattlesModule);
//# sourceMappingURL=battles.module.js.map