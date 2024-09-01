import { Module } from '@nestjs/common';
import { UsersModule } from './entities/users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { upperDirectiveTransformer } from './common/directives/upper-case-directive';
import { ModerationsModule } from './entities/moderations/moderations.module';
import { SupportRequestsModule } from './entities/support-requests/support-requests.module';
import { ReportsModule } from './entities/reports/reports.module';
import { PostsModule } from './entities/posts/posts.module';
import { PlaylistsModule } from './entities/playlists/playlists.module';
import { NotificationsModule } from './entities/notifications/notifications.module';
import { BattlesModule } from './entities/battles/battles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './utils/email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './utils/tasks/tasks.module';
import { PlannedTasksModule } from './entities/planned-tasks/planned-tasks.module';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { UploadModule } from './utils/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { AchievementsModule } from './entities/achievements/achievements.module';
import { OnApplicationBootstrapService } from './utils/init/on-bootstrap';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    // ENV
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MONGODB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        uri: configService.get('MONGO_URL')
      }),
      inject: [ConfigService]
    }),
    // SCHEDULE
    ScheduleModule.forRoot(),
    TasksModule,
    PlannedTasksModule,
    // GQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      playground: true,
    }),
    // FILE UPLOAD
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        dest: configService.get('MULTER_DEST'),
      }),
      inject: [ConfigService]
    }),
    // EMAILS
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
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
          dir: join(__dirname, 'utils', 'email', 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService]
    }),
    // ENTITIES
    UsersModule,
    ModerationsModule,
    SupportRequestsModule,
    ReportsModule,
    PostsModule,
    PlaylistsModule,
    NotificationsModule,
    BattlesModule,
    AuthModule,
    EmailModule,
    AchievementsModule,
    // SOCKET IO 
    // SocketModule,
    UploadModule,
    MinioModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          endPoint: config.get('MINIO_ENDPOINT'),
          port: parseInt(config.get('MINIO_PORT')),
          useSSL: true,
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
        };
      },
    }),
  ],
  providers: [OnApplicationBootstrapService]
})
export class AppModule {}
