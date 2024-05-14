import { Module } from '@nestjs/common';
import { ModerationsService } from './moderations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Moderation, ModerationSchema } from './moderations.schema';
import { ModerationsResolver } from './moderations.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Moderation.name, schema: ModerationSchema }])
  ],
  providers: [ModerationsService, ModerationsResolver]
})
export class ModerationsModule {}
