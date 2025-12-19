import { User } from './users.schema';
import { Model } from 'mongoose';
import { ConfirmAccountDto, CreateUserDto, PrepareToRestoreDto, RestoreAccountDto } from './dto';
import { ModerationsService } from '../moderations/moderations.service';
import { EmailService } from 'src/utils/email/email.service';
import { PostsService } from '../posts/posts.service';
import { AchievementsService } from '../achievements/achievements.service';
export declare class UsersService {
    private userModel;
    private moderationsService;
    private emailService;
    private postsService;
    private achievementsService;
    constructor(userModel: Model<User>, moderationsService: ModerationsService, emailService: EmailService, postsService: PostsService, achievementsService: AchievementsService);
    addUser(user: CreateUserDto): Promise<{
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        action: import("mongoose").Document<unknown, {}, import("../moderations/moderations.schema").Moderation> & import("../moderations/moderations.schema").Moderation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    updateUser(_id: string, value: string | number, what: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getUserByEmail(email: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getUserById(_id: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getUsersByIds(ids: string[]): Promise<(import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getUsersByNickname(nick: string): Promise<(import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    swicthUserSubscription(subscriberId: string, subscribeOnId: string): Promise<{
        subscriber: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        subscribeOn: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    confirmUserAccount(dto: ConfirmAccountDto): Promise<{
        action: import("mongoose").Document<unknown, {}, import("../moderations/moderations.schema").Moderation> & import("../moderations/moderations.schema").Moderation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    restoreAccount({ userId, actionId, verifyToken, type, newValue }: RestoreAccountDto): Promise<{
        action: import("mongoose").Document<unknown, {}, import("../moderations/moderations.schema").Moderation> & import("../moderations/moderations.schema").Moderation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    prepareAccountToRestore({ email, type }: PrepareToRestoreDto): Promise<{
        action: import("mongoose").Document<unknown, {}, import("../moderations/moderations.schema").Moderation> & import("../moderations/moderations.schema").Moderation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    calculateAchievements(userId: string): Promise<any>;
    unlinkGoogle(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    unlinkFacebook(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    unlinkTwitter(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    switchPostInSaved(postId: string, userId: string): Promise<{
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        post: import("mongoose").Document<unknown, {}, import("../posts/posts.schema").Post> & import("../posts/posts.schema").Post & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    switchPostInLiked(postId: string, userId: string): Promise<{
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        post: import("mongoose").Document<unknown, {}, import("../posts/posts.schema").Post> & import("../posts/posts.schema").Post & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    switchPostPinned(postId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getPinnedPosts(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../posts/posts.schema").Post> & import("../posts/posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    linkEmailRequest(newEmail: string, userId: string): Promise<void>;
}
