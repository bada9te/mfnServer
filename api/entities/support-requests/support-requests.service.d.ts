import { SupportRequest } from './support-requests.schema';
import { Model } from 'mongoose';
import { RangeDto } from 'src/common/dto';
import { CreateSupportRequestDto } from './dto';
export declare class SupportRequestsService {
    private supportRequestModel;
    constructor(supportRequestModel: Model<SupportRequest>);
    createSupportRequest(supReq: CreateSupportRequestDto): Promise<import("mongoose").Document<unknown, {}, SupportRequest> & SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllSupportRequsts(range: RangeDto): Promise<(import("mongoose").Document<unknown, {}, SupportRequest> & SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    closeSupportRequest(_id: string): Promise<import("mongoose").Document<unknown, {}, SupportRequest> & SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getSupportRequestById(_id: string): Promise<import("mongoose").Document<unknown, {}, SupportRequest> & SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
