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
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './utils/email/email.module';
import { SocketModule } from './utils/socket/socket.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './utils/tasks/tasks.module';
import { PlannedTasksModule } from './entities/planned-tasks/planned-tasks.module';

@Module({
  imports: [
    // ENV
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // MONGODB
    MongooseModule.forRoot(process.env.MONGO_URL),
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
    // EMAILS
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
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
    SocketModule,
  ],
})
export class AppModule {}
