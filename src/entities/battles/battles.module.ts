import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Battle, BattleSchema } from './battles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Battle.name, schema: BattleSchema }])
  ],
  providers: [BattlesService]
})
export class BattlesModule {}
