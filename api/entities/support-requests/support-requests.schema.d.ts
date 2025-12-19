import { HydratedDocument } from "mongoose";
export type SupportRequestDocument = HydratedDocument<SupportRequest>;
export declare class SupportRequest {
    contactReason: string;
    email: string;
    message: string;
    isClosed: boolean;
}
export declare const SupportRequestSchema: import("mongoose").Schema<SupportRequest, import("mongoose").Model<SupportRequest, any, any, any, import("mongoose").Document<unknown, any, SupportRequest> & SupportRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SupportRequest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<SupportRequest>> & import("mongoose").FlatRecord<SupportRequest> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
