import { Injectable } from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    // add new user
    async addUser(user: any) {
        const inserted = await this.userModel.insertMany([user]);
        return inserted[0];
    }

    // remove user by id
    async deleteUserById(_id: string) {
        return await this.userModel.findByIdAndDelete(_id);
    }

    // update user by id
    async updateUser(_id: string, value: string | number, what: string) {
        return await this.userModel.findOneAndUpdate(
            { _id },
            { [what]: value },
            { new: true }
        );
    }

    // get user by email
    async getUserByEmail(email: string) {
        return await this.userModel.findOne({ 'local.email': email });
    }

    // get by id
    async getUserById(_id: string) {
        return await this.userModel.findById(_id);
    }
}
