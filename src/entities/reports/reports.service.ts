import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './reports.schema';
import { Model } from 'mongoose';
import { ReportCreationDto } from './dto';
import { RangeDto } from 'src/common/dto';

@Injectable()
export class ReportsService {
    constructor(@InjectModel(Report.name) private reportsModel: Model<Report>) {}

    // create
    async createReport(report: ReportCreationDto) {
        const inserted = await this.reportsModel.insertMany([report]);
        return inserted[0];
    }

    // get all
    async getAllReports(range: RangeDto) {
        return await this.reportsModel.find()
            .skip(range.offset)
            .limit(range.limit);
    }

    // close report
    async closeReport(_id: string) {
        return await this.reportsModel.findByIdAndUpdate(
            _id,
            { isClosed: true },
            { new: true, upsert: true }
        );
    }

    // get by id
    async getReportById(_id: string) {
        return await this.reportsModel.findById(_id);
    }
}
