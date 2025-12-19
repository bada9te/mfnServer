import { SupportRequestsService } from "./support-requests.service";
import { CreateSupportRequestDto } from "./dto";
export declare class SupportRequestsResolver {
    private supportRequestsService;
    constructor(supportRequestsService: SupportRequestsService);
    supportRequests(offset: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, import("./support-requests.schema").SupportRequest> & import("./support-requests.schema").SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    supportRequest(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./support-requests.schema").SupportRequest> & import("./support-requests.schema").SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    supportRequestCreate(dto: CreateSupportRequestDto): Promise<import("mongoose").Document<unknown, {}, import("./support-requests.schema").SupportRequest> & import("./support-requests.schema").SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    supportRequestClose(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./support-requests.schema").SupportRequest> & import("./support-requests.schema").SupportRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
