import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmAccountDto, CreateUserDto, PrepareToRestoreDto, RestoreAccountDto } from './dto';
import { ModerationsService } from '../moderations/moderations.service';
import bcrypt from "bcrypt-nodejs";


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private moderationsService: ModerationsService
    ) {}

    // add new user
    async addUser(user: CreateUserDto) {
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

    // get by ids
    async getUsersByIds(ids: string[]) {
        return await this.userModel.find({ _id: ids });
    }

    // get by nickname
    async getUsersByNickname(nick: string) {
        return await this.userModel.find({
            nick: { $regex: '.*' + nick + '.*' }
        }).limit(10);
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
    async confirmUserAccount(dto: ConfirmAccountDto) {
        const action = await this.moderationsService.validateAction({
            ...dto,
            type: 'verify',
        });

        const checkUser = await this.getUserById(dto.userId);

        if (!action || !checkUser) {
            throw new BadRequestException('Invalid verification credentials');
        }

        await this.moderationsService.deleteModeration({
            ...dto,
            type: 'verify',
        });

        const user = await this.userModel.findByIdAndUpdate(
            dto.userId,
            { verified: true },
            { new: true }
        );

        return { action, user };
    }

    // restore account
    // type: "password" | "email"
    async restoreAccount({ userId, actionId, verifyToken, type, newValue }: RestoreAccountDto) {
        const action = await this.moderationsService.validateAction({
            userId,
            actionId,
            verifyToken,
            type,
        });

        if (!action) {
            throw new BadRequestException('Invalid verification credentials');
        }
        
        if (type === "password") {
            type = "local.password";
            newValue = bcrypt.hashSync(newValue, bcrypt.genSaltSync(8));
        } else if (type === "email") {
            type = "local.email";
            // try to find a user with the same email
            const user = await this.getUserByEmail(newValue)
            if (user) {
                throw new BadRequestException("This email was already taken");
            }
        }

        // update user data
        const affectedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { [type]: newValue },
            { new: true }
        );

        if (!affectedUser) {
            throw new BadRequestException("User data can't be updated");
        }

        await this.moderationsService.deleteModeration({
            actionId,
            userId,
            type,
            verifyToken,
        });

        // TODO: send email to affected user email

        return { action, user: affectedUser };
    }

    async prepareAccountToRestore({email, type}: PrepareToRestoreDto) {
        const user = await this.getUserByEmail(email);

        if (!user) {
            throw new BadRequestException("User not found");
        }

        const moderation = await this.moderationsService.createModeration({
            user: user._id.toString(),
            type,
        });

        // TODO: send email to affected user email

        return { action: moderation, user };
    }
}
