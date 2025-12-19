import { Report } from './reports.schema';
import { Model } from 'mongoose';
import { CreateReportDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { PostsService } from '../posts/posts.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ReportsService {
    private reportsModel;
    private postsService;
    private notificationsService;
    constructor(reportsModel: Model<Report>, postsService: PostsService, notificationsService: NotificationsService);
    createReport(report: CreateReportDto): Promise<import("mongoose").Document<unknown, {}, Report> & Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllReports(range: RangeDto): Promise<(import("mongoose").Document<unknown, {}, Report> & Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    closeReport(_id: string): Promise<import("mongoose").Document<unknown, {}, Report> & Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getReportById(_id: string): Promise<import("mongoose").Document<unknown, {}, Report> & Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
