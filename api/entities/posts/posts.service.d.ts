import { Post } from './posts.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
export declare class PostsService {
    private postsModel;
    private notificationsService;
    private usersService;
    constructor(postsModel: Model<Post>, notificationsService: NotificationsService, usersService: UsersService);
    addPost(post: CreatePostDto): Promise<mongoose.MergeType<mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }, Omit<CreatePostDto[], "_id">>>;
    updatePost(_id: string, value: any, what: string): Promise<mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deletePostById(_id: string): Promise<mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deletePostsByIds(ids: string[]): Promise<mongoose.mongo.DeleteResult>;
    getPostById(_id: string): Promise<mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllPosts(range: RangeDto): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getAllWithOwnerId(_id: string, range: RangeDto | null): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getByTitle(title: string): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getByTitleWithUserId(title: string, useOwnerId: boolean, userId: string): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getManyByIds(ids: string[]): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getMostPopularPostsByStartDate(date: Date): Promise<any[]>;
    getPostsByCategory(category: string, range: RangeDto): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getSavedPostsByUserId(userId: string, range: RangeDto): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getDocsCount(filter: any): Promise<number>;
    getDocsCountByCategories(): Promise<{
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
    getPostsLikesAndSavesByOwner(userId: string): Promise<any[]>;
    getMostRecentTracks(): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getMostRecentTracksByFollowing(userId: string): Promise<(mongoose.Document<unknown, {}, Post> & Post & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
}
