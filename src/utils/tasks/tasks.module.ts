import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PlannedTasksModule } from 'src/entities/planned-tasks/planned-tasks.module';

@Module({
  imports: [PlannedTasksModule],
  providers: [TasksService]
})
export class TasksModule {}
