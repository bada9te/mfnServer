import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './reports.schema';
import { ReportsResolver } from './reports.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }])
  ],
  providers: [ReportsService, ReportsResolver],
  exports: [ReportsService],
})
export class ReportsModule {}
