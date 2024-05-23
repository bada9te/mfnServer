import { Module } from '@nestjs/common';
import { PlannedTasksService } from './planned-tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlannedTask, PlannedTasksSchema } from './planned-tasks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: PlannedTask.name, schema: PlannedTasksSchema}]),
  ],
  providers: [PlannedTasksService],
  exports: [PlannedTasksService],
})
export class PlannedTasksModule {}
