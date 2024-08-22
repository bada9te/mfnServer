import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './reports.schema';
import { ReportsResolver } from './reports.resolver';
import { NotificationsModule } from '../notifications/notifications.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    NotificationsModule,
    PostsModule,
    MongooseModule.forFeatureAsync([
      { 
        name: Report.name,  
        useFactory: () => {
          const schema = ReportSchema
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      }
    ])
  ],
  providers: [ReportsService, ReportsResolver],
  exports: [ReportsService],
})
export class ReportsModule {}
