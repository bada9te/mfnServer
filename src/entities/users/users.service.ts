import { Injectable } from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreationDto } from './dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    // add new user
    async addUser(user: UserCreationDto) {
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

    // get by nickname
    async getUserByNickname(nick: string) {
        return await this.userModel.find({
            nick: { $regex: '.*' + nick + '.*' }
        });
    }

    // subscribe or unsubscribe
    async swicthUserSubscription(subscriberId: string, subscribeOnId: string) {
        const subscriberUSER = await this.userModel.findById(subscriberId);
        const subscribeOnUSER = await this.userModel.findById(subscribeOnId);

        if (!subscriberUSER.subscribedOn.find(i => i._id === subscribeOnUSER._id)) {
            const subscriber = await this.userModel.findByIdAndUpdate(
                subscriberId,
                { $push: { subscribedOn: subscribeOnUSER._id } },
                { new: true }
            );
    
            const subscribeOn = await this.userModel.findByIdAndUpdate(
                subscribeOnId,
                { $push: { subscribers: subscriberUSER._id } },
                { new: true }
            );

            return {subscriber, subscribeOn};
        } else {
            const subscriber = await this.userModel.findByIdAndUpdate(
                subscriberId,
                { $pull: { subscribedOn: subscribeOnUSER._id } },
                { new: true }
            );
    
            const subscribeOn = await this.userModel.findByIdAndUpdate(
                subscribeOnId,
                { $pull: { subscribers: subscriberUSER._id } },
                { new: true }
            );

            return {subscriber, subscribeOn};
        }
    }

    // confirm account
    async confirmUserAccount(_id: string) {
        return await this.userModel.findByIdAndUpdate(
            _id,
            { verified: true },
            { new: true }
        );
    }

    // restore account
    async restoreAccount(_id: string, newValue: string, type: "password" | "email") {
        return await this.userModel.findByIdAndUpdate(
            _id,
            { [type]: newValue },
            { new: true }
        );
    }
}
