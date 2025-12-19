import { UsersService } from "./users.service";
import { SwicthSubscriptionDto, UpdateUserDto, CreateUserDto, ConfirmAccountDto, RestoreAccountDto, PrepareToRestoreDto, LinkEmailDto } from "./dto";
import { UserDocument } from "./users.schema";
import { SwicthLikeOrSaveDto } from "./dto/swicth-like-or-save.dto";
export declare class UsersResolver {
    private usersService;
    constructor(usersService: UsersService);
    private validateUserAccess;
    whoAmI(user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    user(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    userByEmail(email: string): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    usersByIds(ids: string[]): Promise<(import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    usersByNickname(nick: string): Promise<(import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    userAchievementsData(_id: string): Promise<any>;
    userPinnedTracks(_id: string): Promise<(import("mongoose").Document<unknown, {}, import("../posts/posts.schema").Post> & import("../posts/posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    userCreate(input: CreateUserDto): Promise<{
        user: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
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
    userUpdate({ _id, what, value }: UpdateUserDto, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    userSwitchSubscription({ subscriberId, userId }: SwicthSubscriptionDto, user: UserDocument): Promise<{
        subscriber: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        subscribeOn: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    userConfirmAccount(dto: ConfirmAccountDto): Promise<{
        action: import("mongoose").Document<unknown, {}, import("../moderations/moderations.schema").Moderation> & import("../moderations/moderations.schema").Moderation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        user: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    userRestoreAccount(dto: RestoreAccountDto): Promise<{
        action: import("mongoose").Document<unknown, {}, import("../moderations/moderations.schema").Moderation> & import("../moderations/moderations.schema").Moderation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        user: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    userPrepareAccountToRestore(dto: PrepareToRestoreDto): Promise<{
        action: import("mongoose").Document<unknown, {}, import("../moderations/moderations.schema").Moderation> & import("../moderations/moderations.schema").Moderation & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        user: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
    }>;
    userUnlinkGoogle(_id: string, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    userUnlinkFacebook(_id: string, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    userUnlinkTwitter(_id: string, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    userSwitchLike(dto: SwicthLikeOrSaveDto, user: UserDocument): Promise<{
        user: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
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
    userSwitchSave(dto: SwicthLikeOrSaveDto, user: UserDocument): Promise<{
        user: import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
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
    userSwitchPostPinned(userId: string, postId: string, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./users.schema").User> & import("./users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    userLinkEmailRequest(input: LinkEmailDto, user: UserDocument): Promise<void>;
}
