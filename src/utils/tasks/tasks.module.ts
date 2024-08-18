import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PlannedTasksModule } from 'src/entities/planned-tasks/planned-tasks.module';
import { BattlesModule } from 'src/entities/battles/battles.module';


@Module({
  imports: [PlannedTasksModule, forwardRef(() => BattlesModule)],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
