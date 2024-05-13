import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Moderation } from './moderations.schema';
import { Model } from 'mongoose';

@Injectable()
export class ModerationsService {
    constructor(@InjectModel(Moderation.name) private moderationsModel: Model<Moderation>) {}
    
}
