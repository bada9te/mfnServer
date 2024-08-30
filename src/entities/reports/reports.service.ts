import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './reports.schema';
import { Model } from 'mongoose';
import { CreateReportDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { PostsService } from '../posts/posts.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Report.name) private reportsModel: Model<Report>,
        private postsService: PostsService,
        private notificationsService: NotificationsService,
    ) {}

    // create
    async createReport(report: CreateReportDto) {
        const inserted = await this.reportsModel.insertMany([report]);
        if (report.reportedPost && !report.email) {
            const post = await this.postsService.getPostById(report.reportedPost);
            if (post) {
                await this.notificationsService.createNotification({
                    receiver: post.owner._id.toString(),
                    post: report.reportedPost,
                    text: "",
                    type: "POST_REPORTED",
                });
            }
        }
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
