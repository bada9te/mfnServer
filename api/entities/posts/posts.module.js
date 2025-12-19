"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const mongoose_1 = require("@nestjs/mongoose");
const posts_schema_1 = require("./posts.schema");
const posts_resolver_1 = require("./posts.resolver");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notifications_module_1.NotificationsModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: posts_schema_1.Post.name,
                    useFactory: () => {
                        const schema = posts_schema_1.PostSchema;
                        schema.plugin(require("mongoose-autopopulate"));
                        return schema;
                    }
                }
            ]),
        ],
        providers: [posts_service_1.PostsService, posts_resolver_1.PostsResolver],
        exports: [posts_service_1.PostsService],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map