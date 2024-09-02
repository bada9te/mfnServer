import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ConfirmAccountDto, CreateUserDto, LinkFacebookDto, LinkGoogleDto, LinkTwitterDto, PrepareToRestoreDto, RestoreAccountDto } from './dto';
import { ModerationsService } from '../moderations/moderations.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/utils/email/email.service';
import { PostsService } from '../posts/posts.service';
import { AchievementsService } from '../achievements/achievements.service';


@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private moderationsService: ModerationsService,
        private emailService: EmailService,
        private postsService: PostsService,
        private achievementsService: AchievementsService,
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
            `${process.env.CLIENT_BASE}/app/account-verify/${inserted[0]._id}/${moderation._id}/${moderation.verifyToken}/${moderation.type}`,
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


    // achievements calculation
    async calculateAchievements(userId: string) {
        const user = await this.getUserById(userId);

        if (!user) {
            throw new BadRequestException("User not found");
        }

        const data = await this.postsService.getPostsLikesAndSavesByOwner(user._id.toString());

        if (data[0]) {
            const {
                postCount, 
                totalLikes, 
                totalSaves, 
                singlePostMaxLikes, 
                singlePostmaxSaves, 
            } = data[0];
    
            const achievements: number[] = [];
    
            if (postCount > 0) {
                achievements.push(1);
    
                // tracks
                if (postCount >= 100) {
                    achievements.push(8);
    
                    postCount >= 250 && achievements.push(12);
                }
    
                // likes
                if (totalLikes > 0) {
                    achievements.push(2);
                    totalLikes >= 1000 && achievements.push(4);
                    singlePostMaxLikes >= 2500 && achievements.push(5);
                    totalLikes >= 5000 && achievements.push(7);
                    totalLikes >= 10000 && achievements.push(9);
                    singlePostMaxLikes >= 10000 && achievements.push(13);
                }
    
                // saves
                if (totalSaves > 0) {
                    achievements.push(3);
    
                    singlePostmaxSaves >= 1000 && achievements.push(6);
                    totalSaves >= 5000 && achievements.push(10);
    
                }
    
                // likes and saves combined
                if (totalLikes + totalSaves >= 20000) {
                    achievements.push(11);
    
                    totalLikes + totalSaves >= 50000 && achievements.push(14);
                    totalLikes + totalSaves >= 100000 && achievements.push(15);
                    totalLikes >= 500000 && totalSaves >= 500000 && achievements.push(18);
                    totalLikes + totalSaves >= 1000000 && achievements.push(19);
                }
            }

            user.achievements = Array.from(new Set([...user.achievements, ...achievements]));
            await user.save();

            const totalRP = (await this.achievementsService.getAllAchievements())
                .filter(i => achievements.includes(i.posNumber))
                .reduce((prev, curr) => prev + curr.rp, 0);

            return { 
                ...data[0],
                achievements,
                totalRP,
            };
        } else {
            return {
                achievements: [],
                totalRP: 0,
                totalLikes: 0,
                totalSaves: 0,
                maxLikesByPost: 0,
                maxSavesByPost: 0,
                postCount: 0,
            }
        }
    }


    // link google
    async linkGoogle(dto: LinkGoogleDto) {
        const user = await this.getUserById(dto.userId);
        const userWithGoogle = await this.userModel.findOne({"google.id": dto.id}); 

        if (!user || userWithGoogle) {
            throw new BadRequestException();
        }

        user.google = {
            id: dto.id,
            token: dto.token,
            name: dto.name,
            email: dto.email,
        }

        return await user.save();
    }

    // unlink google 
    async unlinkGoogle(userId: string) {
        const user = await this.getUserById(userId);

        if (!user) {
            throw new BadRequestException();
        }

        user.google = null;

        return await user.save();
    }

    // link Facebook
    async linkFacebook(dto: LinkFacebookDto) {
        const user = await this.getUserById(dto.userId);
        const userWithFacebook = await this.userModel.findOne({"facebook.id": dto.id});

        if (!user || userWithFacebook) {
            throw new BadRequestException();
        }

        user.facebook = {
            id: dto.id,
            token: dto.token,
            name: dto.name,
        }

        return await user.save();
    }

    // unlink facebook 
    async unlinkFacebook(userId: string) {
        const user = await this.getUserById(userId);

        if (!user) {
            throw new BadRequestException();
        }

        user.facebook = null;

        return await user.save();
    }

    // link twitter
    async linkTwitter(dto: LinkTwitterDto) {
        const user = await this.getUserById(dto.userId);
        const userWithTwitter = this.userModel.findOne({"twitter.id": dto.id});

        if (!user || userWithTwitter) {
            throw new BadRequestException();
        }

        user.twitter = {
            id: dto.id,
            token: dto.token,
            name: dto.name
        }

        return await user.save();
    }

    // unlink twitter 
    async unlinkTwitter(userId: string) {
        const user = await this.getUserById(userId);

        if (!user) {
            throw new BadRequestException();
        }

        user.twitter = null;

        return await user.save();
    }

    async switchPostInSaved(postId: string, userId: string) {
        const user = await this.userModel.findById(userId);
        const post = await this.postsService.getPostById(postId)

        if (user.savedPosts.map(i => i._id.toString()).includes(post._id.toString())) {
            user.savedPosts = user.savedPosts.filter(i => i._id.toString() !== post._id.toString());
            post.saves--;
        } else {
            user.savedPosts.push(post);
            post.saves++;
        }
        await post.save();
        await user.save();
        return {user, post};
    }

    async switchPostInLiked(postId: string, userId: string) {
        const user = await this.userModel.findById(userId);
        const post = await this.postsService.getPostById(postId);

        if (user.likedPosts.map(i => i._id.toString()).includes(post._id.toString())) {
            user.likedPosts = user.likedPosts.filter(i => i._id.toString() !== post._id.toString());
            post.likes--;
        } else {
            user.likedPosts.push(post);
            post.likes++;
        }
        await post.save();
        await user.save();
        return {user, post};
    }

    async switchPostPinned(postId: string, userId: string) {
        const user = await this.userModel.findById(userId);
        const post = await this.postsService.getPostById(postId);
        
        if (user.pinnedPosts.map(i => i._id.toString()).includes(post._id.toString())) {
            user.pinnedPosts = user.pinnedPosts.filter(i => i._id.toString() !== post._id.toString());
        } else {
            user.pinnedPosts.push(post);
        }
        await user.save();
        return user;
    }
}
