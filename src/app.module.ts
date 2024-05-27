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
import { CommentsModule } from './entities/comments/comments.module';
import { ChatsModule } from './entities/chats/chats.module';
import { ChatMessagesModule } from './entities/chat-messages/chat-messages.module';
import { BattlesModule } from './entities/battles/battles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './utils/email/email.module';
import { SocketModule } from './utils/socket/socket.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './utils/tasks/tasks.module';
import { PlannedTasksModule } from './entities/planned-tasks/planned-tasks.module';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { UploadModule } from './utils/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';

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
    CommentsModule,
    ChatsModule,
    ChatMessagesModule,
    BattlesModule,
    AuthModule,
    EmailModule,
    // SOCKET IO 
    SocketModule,
    UploadModule,
  ],
})
export class AppModule {}
