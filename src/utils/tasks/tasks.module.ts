import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PlannedTasksModule } from '../../entities/planned-tasks/planned-tasks.module';
import { BattlesModule } from '../../entities/battles/battles.module';
import { NotificationsModule } from '../../entities/notifications/notifications.module';


@Module({
  imports: [
    PlannedTasksModule, 
    forwardRef(() => BattlesModule),
    NotificationsModule,
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
