import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';

@Module({
  providers: [BattlesService]
})
export class BattlesModule {}
