import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmAccountDto, CreateUserDto, PrepareToRestoreDto, RestoreAccountDto } from './dto';
import { ModerationsService } from '../moderations/moderations.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/utils/email/email.service';
import generateRandomString from 'src/utils/functions/generateRandomString';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private moderationsService: ModerationsService,
        private emailService: EmailService,
    ) {}

    // add new user
    async addUser(user: CreateUserDto) {
        const userInDB = await this.userModel.findOne({ "local.email": user.email });

        if (userInDB) {
            throw new BadRequestException("User already exists");
        }

        const toInsert = {
            ...user,
            local: {
                email: user.email,
                password: await bcrypt.hash(user.password, await bcrypt.genSalt(8))
            }
        }
        const inserted = await this.userModel.insertMany([toInsert]);

        const moderation = await this.moderationsService.createModeration({
            user: inserted[0]._id.toString(),
            type: "verify",
        });

        this.emailService.sendVerificationEmail(
            inserted[0].local.email,
            inserted[0].nick,
            `${process.env.CLIENT_BASE}/app/account-verify/${inserted[0]._id}/${moderation._id}`,
            moderation.verifyToken
        );
        return {
            user: inserted[0],
            action: moderation,
        };
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
            newValue = await bcrypt.hash(newValue, await bcrypt.genSalt(8));
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

        // TODO: send email to affected user
        this.emailService.sendInformationEmail(
            affectedUser.local.email, 
            affectedUser.nick, 
            `Your account ${type} was successfully updated.` 
        );

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

        this.emailService.sendRestorationEmail(
            user.local.email,
            user.nick,
            `${process.env.CLIENT_BASE}/app/account-restore/${user._id}/${moderation._id}/${moderation.verifyToken}/${type}`,
        );

        return { action: moderation, user };
    }
}
