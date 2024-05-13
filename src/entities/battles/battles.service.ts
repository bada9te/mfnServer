import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Battle } from './battles.schema';
import { Model } from 'mongoose';

@Injectable()
export class BattlesService {
    constructor(@InjectModel(Battle.name) private battlesModel: Model<Battle>) {}
    
}
