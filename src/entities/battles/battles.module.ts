import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Battle, BattleSchema } from './battles.schema';
import { BattlesResolver } from './battles.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Battle.name, schema: BattleSchema }])
  ],
  providers: [BattlesService, BattlesResolver],
  exports: [BattlesService],
})
export class BattlesModule {}
