"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const mongoose_1 = require("@nestjs/mongoose");
const users_schema_1 = require("./users.schema");
const users_resolver_1 = require("./users.resolver");
const moderations_service_1 = require("../moderations/moderations.service");
const moderations_schema_1 = require("../moderations/moderations.schema");
const email_module_1 = require("../../utils/email/email.module");
const graphql_schema_1 = require("../../graphql/graphql.schema");
const posts_schema_1 = require("../posts/posts.schema");
const posts_module_1 = require("../posts/posts.module");
const notifications_module_1 = require("../notifications/notifications.module");
const achievements_module_1 = require("../achievements/achievements.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            email_module_1.EmailModule,
            posts_module_1.PostsModule,
            notifications_module_1.NotificationsModule,
            achievements_module_1.AchievementsModule,
            mongoose_1.MongooseModule.forFeatureAsync([{
                    name: users_schema_1.User.name,
                    useFactory: () => {
                        const schema = users_schema_1.UserSchema;
                        schema.plugin(require('mongoose-autopopulate'));
                        return schema;
                    }
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: moderations_schema_1.Moderation.name, schema: moderations_schema_1.ModerationSchema
                }]),
            mongoose_1.MongooseModule.forFeature([{
                    name: graphql_schema_1.Post.name, schema: posts_schema_1.PostSchema
                }]),
        ],
        providers: [users_service_1.UsersService, moderations_service_1.ModerationsService, users_resolver_1.UsersResolver],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map