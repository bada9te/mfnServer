import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PlannedTasksModule } from 'src/entities/planned-tasks/planned-tasks.module';
import { BattlesModule } from 'src/entities/battles/battles.module';
import { NotificationsModule } from 'src/entities/notifications/notifications.module';


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
