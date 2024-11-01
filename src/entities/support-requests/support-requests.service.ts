import { Injectable } from '@nestjs/common';
import { SupportRequest } from './support-requests.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RangeDto } from 'src/common/dto';
import { CreateSupportRequestDto } from './dto';

@Injectable()
export class SupportRequestsService {
    constructor(@InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequest>) {}

    // create
    async createSupportRequest(supReq: CreateSupportRequestDto) {
        const inserted = await this.supportRequestModel.create(supReq);
        return inserted;
    }

    // get all
    async getAllSupportRequsts(range: RangeDto) {
        return await this.supportRequestModel.find()
            .skip(range.offset)
            .limit(range.limit);
    }

    // close
    async closeSupportRequest(_id: string) {
        return await this.supportRequestModel.findByIdAndUpdate(
            _id,
            { isClosed: true },
            { new: true, upsert: true }
        );
    }

    // get by id
    async getSupportRequestById(_id: string) {
        return await this.supportRequestModel.findById(_id);
    }
}
