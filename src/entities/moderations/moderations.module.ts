import { Module } from '@nestjs/common';
import { ModerationsService } from './moderations.service';

@Module({
  providers: [ModerationsService]
})
export class ModerationsModule {}
