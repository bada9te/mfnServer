import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";
export type ReportDocument = HydratedDocument<Report>;
export declare class Report {
    contactReason: string;
    email: string;
    message: string;
    reportOwner: UserDocument;
    reportedPost: PostDocument;
    isClosed: boolean;
}
export declare const ReportSchema: mongoose.Schema<Report, mongoose.Model<Report, any, any, any, mongoose.Document<unknown, any, Report> & Report & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Report, mongoose.Document<unknown, {}, mongoose.FlatRecord<Report>> & mongoose.FlatRecord<Report> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
