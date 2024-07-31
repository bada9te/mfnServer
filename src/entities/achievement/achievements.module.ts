import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Achievement, AchievementSchema } from './achievements.schema';
import { AchievementsService } from './achievements.service';
import { AchievementResolver } from './achievements.resolver';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Achievement.name, schema: AchievementSchema }])
  ],
  providers: [AchievementsService, AchievementResolver],
  exports: [AchievementsService],
})
export class AchievementsModule {}
