import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './reports.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }])
  ],
  providers: [ReportsService]
})
export class ReportsModule {}
