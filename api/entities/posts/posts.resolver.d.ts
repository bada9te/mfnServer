import { PostsService } from "./posts.service";
import { CreatePostDto, PostsByTitleDto, UpdatePostDto } from "./dto";
import { UserDocument } from "../users/users.schema";
export declare class PostsResolver {
    private postsService;
    constructor(postsService: PostsService);
    private validateUserAccess;
    post(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    posts(offset: number, limit: number): Promise<{
        posts: (import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    postsByOwner(owner: string, offset: number, limit: number): Promise<{
        posts: (import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    postsByTitle(dto: PostsByTitleDto): Promise<(import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    postsByIds(ids: string[]): Promise<(import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    postsMostPopular(date: string): Promise<any[]>;
    postsByCategory(category: string, offset: number, limit: number): Promise<{
        posts: (import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    postsSavedByUser(user: string, offset: number, limit: number): Promise<{
        posts: (import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    postsByCategoryCount(): Promise<{
        country: number;
        pop: number;
        classical: number;
        funk: number;
        soul: number;
        hipHop: number;
        rock: number;
        electronic: number;
        latin: number;
        jazz: number;
        blues: number;
        folk: number;
        metal: number;
        reggae: number;
    }>;
    postsMostRecent(): Promise<(import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    postsMostRecentByFollowing(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    postCreate(dto: CreatePostDto, user: UserDocument): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }, Omit<CreatePostDto[], "_id">>>;
    postUpdate({ post, value, what }: UpdatePostDto, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    postDeleteById(_id: string, user: UserDocument): Promise<import("mongoose").Document<unknown, {}, import("./posts.schema").Post> & import("./posts.schema").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
