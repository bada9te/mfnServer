"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("./entities/users/users.module");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const upper_case_directive_1 = require("./common/directives/upper-case-directive");
const moderations_module_1 = require("./entities/moderations/moderations.module");
const support_requests_module_1 = require("./entities/support-requests/support-requests.module");
const reports_module_1 = require("./entities/reports/reports.module");
const posts_module_1 = require("./entities/posts/posts.module");
const playlists_module_1 = require("./entities/playlists/playlists.module");
const notifications_module_1 = require("./entities/notifications/notifications.module");
const battles_module_1 = require("./entities/battles/battles.module");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const email_module_1 = require("./utils/email/email.module");
const mailer_1 = require("@nestjs-modules/mailer");
const schedule_1 = require("@nestjs/schedule");
const tasks_module_1 = require("./utils/tasks/tasks.module");
const planned_tasks_module_1 = require("./entities/planned-tasks/planned-tasks.module");
const path_1 = require("path");
const ejs_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/ejs.adapter");
const platform_express_1 = require("@nestjs/platform-express");
const achievements_module_1 = require("./entities/achievements/achievements.module");
const on_bootstrap_1 = require("./utils/init/on-bootstrap");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            tasks_module_1.TasksModule,
            planned_tasks_module_1.PlannedTasksModule,
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                typePaths: ['./**/*.graphql'],
                transformSchema: schema => (0, upper_case_directive_1.upperDirectiveTransformer)(schema, 'upper'),
                installSubscriptionHandlers: true,
                playground: true,
            }),
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    dest: configService.get('MULTER_DEST'),
                }),
                inject: [config_1.ConfigService],
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    transport: {
                        host: configService.get('EMAIL_HOST'),
                        secure: true,
                        tls: {
                            ciphers: "SSLv3",
                        },
                        requireTLS: true,
                        port: 465,
                        debug: true,
                        connectionTimeout: 10000,
                        auth: {
                            user: configService.get('EMAIL_USERNAME'),
                            pass: configService.get('EMAIL_PASSWORD'),
                        },
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, 'utils', 'email', 'templates'),
                        adapter: new ejs_adapter_1.EjsAdapter(),
                        options: {
                            strict: false,
                        },
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            moderations_module_1.ModerationsModule,
            support_requests_module_1.SupportRequestsModule,
            reports_module_1.ReportsModule,
            posts_module_1.PostsModule,
            playlists_module_1.PlaylistsModule,
            notifications_module_1.NotificationsModule,
            battles_module_1.BattlesModule,
            auth_module_1.AuthModule,
            email_module_1.EmailModule,
            achievements_module_1.AchievementsModule,
        ],
        providers: [on_bootstrap_1.OnApplicationBootstrapService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map