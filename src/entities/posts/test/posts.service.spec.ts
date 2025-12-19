import mongoose, { Model } from "mongoose";
import { PostsService } from "../posts.service";
import { Post } from "../posts.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { NotificationsService } from "../entities/notifications/notifications.service";
import { UsersService } from "../entities/users/users.service";


describe('PostsService', () => {
    let postsService: PostsService;
    let model: Model<Post>;


    const mockPost = {
        _id: "96d434125a96r56fe329a300",
        owner: {
            _id: "507f1f77bcf86cd799439011",
        },
        likes: 1,
        saves: 0,
        title: "test",
        description: "test",
        category: "test-cat",
    };

    const mockPostModel = {
        insertMany: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        deleteMany: jest.fn(),
        findById: jest.fn(),
        find: jest.fn(),
        aggregate: jest.fn(),
    };

    const mockNotificationsService = {
        createManyNotifications: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    const mockUsersService = {
        getUserById: jest.fn().mockResolvedValue({ savedPosts: [mockPost._id], subscribedOn: [mockPost.owner._id] }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostsService,
                { provide: getModelToken(Post.name), useValue: mockPostModel },
                { provide: NotificationsService, useValue: mockNotificationsService },
                { provide: UsersService, useValue: mockUsersService }
            ]
        }).compile();

        postsService = module.get<PostsService>(PostsService);
        model = module.get<Model<Post>>(getModelToken(Post.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addPost', () => {
        it('should add and return a post', async() => {
            const expectedReturnValue = {
                ...mockPost,
                owner: {
                    ...mockPost.owner,
                    subscribers: [{_id: "a"}, {_id: "b"}, {_id: "c"}],
                },
            }
            jest.spyOn(model, 'insertMany').mockImplementation(() => Promise.resolve([expectedReturnValue] as any));

            const input = {
                owner: "test",
                title: "test",
                description: "test",
                audio: "test",
                image: "test",
                category: "test",
                downloadsAllowed: true,
            };

            const res = await postsService.addPost(input);
            expect(model.insertMany).toHaveBeenCalledWith([input], {populate: ["owner"]});
            expect(res).toEqual(expectedReturnValue);
        });
    });

    describe('updatePost', () => {
        it('should update post and return new one', async() => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockPost);

            const res = await postsService.updatePost(
                mockPost._id, 
                "new-value", 
                "title",
            );

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
                mockPost._id,
                { "title": "new-value" },
                { new: true }
            );
            expect(res).toEqual(mockPost);
        });
    });

    describe('deletePostById', () => {
        it('should find post and delete it', async() => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockPost);

            const res = await postsService.deletePostById(mockPost._id);
            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockPost._id);
            expect(res).toEqual(mockPost);
        });
    });

    describe('deletePostsByIds', () => {
        it('should find post and delete it', async() => {
            jest.spyOn(model, 'deleteMany').mockResolvedValue([mockPost] as any);

            const res = await postsService.deletePostsByIds([mockPost._id]);
            expect(model.deleteMany).toHaveBeenCalledWith({ _id: [mockPost._id] });
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getPostById', () => {
        it('should find and return post by id', async() => {
            jest.spyOn(model, 'findById').mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue(mockPost),
            } as any));


            const res = await postsService.getPostById(mockPost._id);
            expect(model.findById).toHaveBeenCalledWith(mockPost._id);
            expect(res).toEqual(mockPost);
        });
    });

    describe('getAllPosts', () => {
        it('should find and return a list of posts', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        populate: () => ({
                            sort: jest.fn().mockResolvedValue([mockPost]),
                        }),
                    }),
                }),
            } as any));

            const res = await postsService.getAllPosts({
                offset: 0,
                limit: 6,
            });

            expect(model.find).toHaveBeenCalledWith({});
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getAllWithOwnerId', () => {
        it('should find and return a list of posts by owner id (with range)', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        populate: () => ({
                            sort: jest.fn().mockResolvedValue([mockPost]),
                        }),
                    }),
                }),
            } as any));

            const res = await postsService.getAllWithOwnerId(
                mockPost.owner._id, 
                {
                    offset: 0,
                    limit: 6,
                }
            );

            expect(model.find).toHaveBeenCalledWith({ owner: mockPost.owner._id });
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getByTitle', () => {
        it('should find and return posts by title', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue([mockPost]),
            } as any));

            const res = await postsService.getByTitle(mockPost.title);
            expect(model.find).toHaveBeenCalledWith({title: { $regex: '.*' + mockPost.title + '.*' }});
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getByTitleWithUserId', () => {
        it('should find and return posts by title and owner id', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue([mockPost]),
            } as any));

            const res = await postsService.getByTitleWithUserId(
                mockPost.title,
                true,
                mockPost.owner._id,
            );
            expect(model.find).toHaveBeenCalledWith(
                {
                    title: { $regex: '.*' + mockPost.title + '.*' },
                    owner: mockPost.owner._id 
                }
            );
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getManyByIds', () => {
        it('shoudl return a list of posts by ids', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue([mockPost]),
            } as any));

            const res = await postsService.getManyByIds([mockPost._id]);

            expect(model.find).toHaveBeenCalledWith({_id: [mockPost._id]});
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getMostPopularPostsByStartDate', () => {
        it('should return a list of most recent popular tracks', async() => {
            jest.spyOn(model, 'aggregate').mockImplementation(() => ({
                sort: () => ({
                    limit: jest.fn().mockResolvedValue([mockPost]),
                })
            } as any));

            const date = new Date();
            const res = await postsService.getMostPopularPostsByStartDate(date);
            expect(model.aggregate).toHaveBeenCalledWith([
                {
                    $match: {
                        createdAt: { $gte: date }
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'owner',
                        foreignField: '_id',
                        as: 'owner'
                    }
                },
                {
                    $set: {
                        owner: { $first: "$owner" }
                    }
                },
                {
                    $addFields: {
                        score: { $sum: [{ $size: "$likes" }, {$size: "$saves"}] }
                    }
                },
            ]);
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getPostsByCategory', () => {
        it('should retrun a list of posts by category (with range)', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        populate: () => ({
                            sort: jest.fn().mockResolvedValue([mockPost]),
                        }),
                    }),
                }),
            } as any));

            const res = await postsService.getPostsByCategory(
                mockPost.category, 
                {
                    offset: 0,
                    limit: 6,
                }
            );

            expect(model.find).toHaveBeenCalledWith({ category: mockPost.category });
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getSavedPostsByUserId', () => {
        it('should find and return a list of posts saved by user', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        populate: jest.fn().mockResolvedValue([mockPost]),
                    }),
                }),
            } as any));

            const res = await postsService.getSavedPostsByUserId(
                mockPost.owner._id,
                {
                    offset: 0,
                    limit: 6,
                }
            );

            expect(model.find).toHaveBeenCalledWith({_id: [mockPost._id]});
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getPostsLikesAndSavesByOwner', () => {
        it('should find and return posts likes and saves count by owner', async() => {
            jest.spyOn(model, 'aggregate').mockResolvedValue({
                totalLikes: 1,
                totalSaves: 1,
                maxLikesByPost: 1,
                maxSavesByPost: 1,
                postCount: 1,
                maxLikesPostId: 0,
                maxSavesPostId: 0,
            } as any);

            const res = await postsService.getPostsLikesAndSavesByOwner(mockPost.owner._id);
            expect(model.aggregate).toHaveBeenCalledWith(
                [
                    // Match posts by owner
                    { $match: { owner: new mongoose.Types.ObjectId(mockPost.owner._id) } },
                    
                    // Group by owner to calculate total likes, total saves, etc.
                    {
                        $group: {
                            _id: "$owner",
                            totalLikes: { $sum: "$likes" },
                            totalSaves: { $sum: "$saves" },
                            maxLikesByPost: { $max: "$likes" },
                            maxSavesByPost: { $max: "$saves" },
                            postCount: { $sum: 1 }
                        }
                    },
                    
                    // Lookup posts with max likes
                    {
                        $lookup: {
                            from: "posts", // Assuming the collection name is 'posts'
                            let: { maxLikes: "$maxLikesByPost" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$likes", "$$maxLikes"] } } },
                                { $project: { _id: 1, likes: 1 } }
                            ],
                            as: "postsWithMaxLikes"
                        }
                    },
                    
                    // Lookup posts with max saves
                    {
                        $lookup: {
                            from: "posts", // Assuming the collection name is 'posts'
                            let: { maxSaves: "$maxSavesByPost" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$saves", "$$maxSaves"] } } },
                                { $project: { _id: 1, saves: 1 } }
                            ],
                            as: "postsWithMaxSaves"
                        }
                    },
                    
                    // Project final output
                    {
                        $project: {
                            _id: 0,
                            totalLikes: 1,
                            totalSaves: 1,
                            maxLikesByPost: 1,
                            maxSavesByPost: 1,
                            postCount: 1,
                            maxLikesPostId: { $arrayElemAt: ["$postsWithMaxLikes._id", 0] },
                            maxSavesPostId: { $arrayElemAt: ["$postsWithMaxSaves._id", 0] }
                        }
                    }
                ]
            );
        });
    });

    describe('getMostRecentTracks', () => {
        it('should find and return most recent posts', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                sort: () => ({
                    limit: jest.fn().mockResolvedValue([mockPost])
                })
            } as any));

            const res = await postsService.getMostRecentTracks();
            expect(model.find).toHaveBeenCalledWith({});
            expect(res).toEqual([mockPost]);
        });
    });

    describe('getMostRecentTracksByFollowing', () => {
        it('should find and return a list of most recen tracks by following array', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                sort: () => ({
                    populate: () => ({
                        limit: jest.fn().mockResolvedValue([mockPost])
                    }),
                }),
            } as any));

            const res = await postsService.getMostRecentTracksByFollowing(mockPost.owner._id);

            expect(model.find).toHaveBeenCalledWith({ owner: [mockPost.owner._id] });
            expect(res).toEqual([mockPost]);
        });
    });
});