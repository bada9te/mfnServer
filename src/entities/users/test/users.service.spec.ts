import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users.service";
import { User, UserDocument } from "../users.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ModerationsService } from "../../moderations/moderations.service";
import { EmailService } from "src/utils/email/email.service";
import { PostsService } from "../../posts/posts.service";
import { AchievementsService } from "../../achievements/achievements.service";
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from "@nestjs/common";
import { PrepareToRestoreDto, RestoreAccountDto } from "../dto";

describe('UsersService', () => {
    let usersService: UsersService;
    let model: Model<User>;

    const mockUser = {
        _id: "66d434125a960f3fe329a338",
        local: {
            email: "test@mail.jest",
        },
        nick: "jestUser",
        subscribers: [],
        achievements: [],
        google: { a: 1 },
        facebook: { a: 1 },
        twitter: { a: 1 },
        savedPosts: [],
        likedPosts: [],
        pinnedPosts: [],
        save: jest.fn(),
    };


    const mockUser2 = {
        ...mockUser,
        _id: "0000bc125a960f3fe329111a",
        local: {
            email: "test2@mail.jest",
        },
        nick: "jestUser2",
    };

    const mockPost = {
        _id: "2030bc125adddf3fe329111g",
        saves: 0,
        likes: 0,
        save: jest.fn(),
    };

    const mockUserModel = {
        findById: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    // Mock for dependencies
    const mockModerationsService = {
        createModeration: jest.fn().mockResolvedValue({
            _id: "111004125a960f3fe329a999",
            type: "jest-test-type",
            verifyToken: "jest-verify-test-token"
        }),
        validateAction: jest.fn(),
        deleteModeration: jest.fn(),
    };
    const mockEmailService = {
        sendVerificationEmail: jest.fn().mockImplementation(
            () => Promise.resolve()
        ),
        sendInformationEmail: jest.fn().mockImplementation(
            () => Promise.resolve()
        ),
        sendRestorationEmail: jest.fn().mockImplementation(
            () => Promise.resolve()
        ),
        sendEmailLinkingEmail: jest.fn().mockImplementation(
            () => Promise.resolve()
        ),
    };
    const mockPostsService = {
        getPostsLikesAndSavesByOwner: jest.fn(),
        getAllAchievements: jest.fn(),
        getPostById: jest.fn(),
    };
    const mockAchievementsService = {
        calculateAchievements: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getModelToken(User.name), useValue: mockUserModel           },
                { provide: ModerationsService,       useValue: mockModerationsService  },
                { provide: EmailService,             useValue: mockEmailService        },
                { provide: PostsService,             useValue: mockPostsService        },
                { provide: AchievementsService,      useValue: mockAchievementsService },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        model = module.get<Model<User>>(getModelToken(User.name));

        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('someSalt');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserById', () => {
        it('should find and return a user by id', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockUser);
            const res = await usersService.getUserById(mockUser._id);

            expect(model.findById).toHaveBeenCalledWith(mockUser._id);
            expect(res).toEqual(mockUser);
        });
    });

    describe('getUserByEmail', () => {
        it('should find and return user by email', async() => {
            jest.spyOn(model, 'findOne').mockResolvedValue(mockUser);
            const res = await usersService.getUserByEmail(mockUser.local.email);

            expect(model.findOne).toHaveBeenCalledWith({ 'local.email': mockUser.local.email });
            expect(res).toEqual(mockUser);
        });
    });

    describe('getUsersByIds', () => {
        it('should find and return a list of users by ids array', async() => {
            jest.spyOn(model, 'find').mockResolvedValue([mockUser]);
            const res = await usersService.getUsersByIds([mockUser._id]);

            expect(model.find).toHaveBeenCalledWith({ _id: [mockUser._id] });
            expect(res).toEqual([mockUser]);
        });
    });

    describe('getUsersByNickname', () => {
        it('should find and return a list of users by nickname', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                limit: jest.fn().mockResolvedValue([mockUser]),
            } as any));

            const res = await usersService.getUsersByNickname(mockUser.nick);
            expect(model.find).toHaveBeenCalledWith({
                nick: { $regex: '.*' + mockUser.nick + '.*' }
            });
            expect(res).toEqual([mockUser]);
        });
    });

    describe('addUser', () => {
        it('should insert a new user into db and return it', async() => {
            const newUser = {
                email: "newemail@jest.test",
                nick: "jest-test-insert",
                password: "jest-passwd-test",
            };

            jest.spyOn(model, 'findOne').mockResolvedValue(null);
            jest.spyOn(model, 'create')
                .mockImplementation(() => Promise.resolve(mockUser as any));

            const res = await usersService.addUser(newUser);

            const inserted = {
                nick: newUser.nick,
                local: {
                    email: newUser.email,
                    password: 'hashedPassword'
                }
            }
            
            expect(model.findOne).toHaveBeenCalledWith({ "local.email": newUser.email });
            expect(model.create).toHaveBeenCalledWith(inserted);
            expect(res.user).toEqual(mockUser);
        });
    });

    describe('updateUser', () => {
        it('should update a user and return it', async() => {
            const updatedUser = { ...mockUser, nick: "UPDATED_NICK" };

            jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(updatedUser);
            const res = await usersService.updateUser(mockUser._id, updatedUser.nick, "nick");

            expect(model.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockUser._id },
                { "nick": updatedUser.nick },
                { new: true }
            );
            expect(res).toEqual(updatedUser);
        });
    });

    describe('switchUserSubscription', () => {
        const subscriberId = mockUser._id;
        const subscribeOnId = mockUser2._id;

        it('should add subscriberId to subscribeOnId list when not already subscribed', async () => {
            const mockSubscriberWithNoSubscriptions = {
                _id: subscriberId,
                subscribedOn: [],
            };
            const mockSubscribeOnUserWithNoSubscribers = {
                _id: subscribeOnId,
                subscribers: [],
            };
    
            mockUserModel.findById
                .mockResolvedValueOnce(mockSubscriberWithNoSubscriptions)
                .mockResolvedValueOnce(mockSubscribeOnUserWithNoSubscribers); 
            
            mockUserModel.findByIdAndUpdate
                .mockResolvedValueOnce({
                    ...mockSubscriberWithNoSubscriptions,
                    subscribedOn: [{ _id: subscribeOnId }],
                })
                .mockResolvedValueOnce({
                    ...mockSubscribeOnUserWithNoSubscribers,
                    subscribers: [{ _id: subscriberId }],
                });
    
            const result = await usersService.swicthUserSubscription(subscriberId, subscribeOnId);
    
            expect(mockUserModel.findById).toHaveBeenCalledWith(subscriberId);
            expect(mockUserModel.findById).toHaveBeenCalledWith(subscribeOnId);
    
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                subscriberId,
                { $push: { subscribedOn: subscribeOnId } },
                { new: true }
            );
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                subscribeOnId,
                { $push: { subscribers: subscriberId } },
                { new: true }
            );
    
            expect(result).toEqual({
                subscriber: { ...mockSubscriberWithNoSubscriptions, subscribedOn: [{ _id: subscribeOnId }] },
                subscribeOn: { ...mockSubscribeOnUserWithNoSubscribers, subscribers: [{ _id: subscriberId }] },
            });
        });
    
        it('should remove subscriberId from subscribeOnId list when already subscribed', async () => {
            const mockSubscriberWithSubscription = {
                _id: subscriberId,
                subscribedOn: [{ _id: subscribeOnId }],
            };
            const mockSubscribeOnUserWithSubscriber = {
                _id: subscribeOnId,
                subscribers: [{ _id: subscriberId }],
            };
    
            mockUserModel.findById
                .mockResolvedValueOnce(mockSubscriberWithSubscription)
                .mockResolvedValueOnce(mockSubscribeOnUserWithSubscriber);
            
            mockUserModel.findByIdAndUpdate
                .mockResolvedValueOnce({
                    ...mockSubscriberWithSubscription,
                    subscribedOn: [],
                })
                .mockResolvedValueOnce({
                    ...mockSubscribeOnUserWithSubscriber,
                    subscribers: [],
                });
    
            const result = await usersService.swicthUserSubscription(subscriberId, subscribeOnId);
    
            expect(mockUserModel.findById).toHaveBeenCalledWith(subscriberId);
            expect(mockUserModel.findById).toHaveBeenCalledWith(subscribeOnId);
    
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                subscriberId,
                { $pull: { subscribedOn: subscribeOnId } },
                { new: true }
            );
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                subscribeOnId,
                { $pull: { subscribers: subscriberId } },
                { new: true }
            );
    
            expect(result).toEqual({
                subscriber: { ...mockSubscriberWithSubscription, subscribedOn: [] },
                subscribeOn: { ...mockSubscribeOnUserWithSubscriber, subscribers: [] },
            });
        });
    });

    describe('confirmUserAccount', () => {
        const dto = {
            userId: "66d434125a960f3fe329a338",
            token: "some-verification-token",
        };
        const mockAction = { id: 'actionId', type: 'verify', userId: dto.userId };
        const mockUser = { 
            _id: dto.userId, 
            verified: false,
            local: { email: "test@mail.jest" },
            nick: "jestUser",
            subscribers: [], 
        };
    
        it('should successfully confirm the user account', async () => {
            // Mocking validateAction to return a valid action
            jest.spyOn(mockModerationsService, 'validateAction').mockResolvedValue(mockAction);
            
            // Mocking getUserById to return a valid user
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
        
            // Mocking deleteModeration to simulate successful deletion
            jest.spyOn(mockModerationsService, 'deleteModeration').mockResolvedValue(undefined);
        
            // Mocking findByIdAndUpdate to simulate updating the user as verified
            jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockUser,
                verified: true,
            });
        
            const result = await usersService.confirmUserAccount({
                userId: dto.userId, 
                actionId: mockAction.id,
                verifyToken: dto.token,
            });
        
            expect(mockModerationsService.validateAction).toHaveBeenCalledWith({
                userId: dto.userId,
                verifyToken: dto.token,
                type: 'verify',
                actionId: mockAction.id
            });
            expect(usersService.getUserById).toHaveBeenCalledWith(dto.userId);
            expect(mockModerationsService.deleteModeration).toHaveBeenCalledWith({
                userId: dto.userId,
                verifyToken: dto.token,
                type: 'verify',
                actionId: mockAction.id
            });
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                dto.userId,
                { verified: true },
                { new: true }
            );
        
            expect(result).toEqual({
                action: mockAction,
                user: { ...mockUser, verified: true },
            });
        });
        
    
        it('should throw BadRequestException when verification action or user is invalid', async () => {
            // Mock validateAction or getUserById to return null
            jest.spyOn(mockModerationsService, 'validateAction').mockResolvedValue(null);
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
    
            await expect(usersService.confirmUserAccount({
                userId: dto.userId, 
                actionId: mockAction.id, 
                verifyToken: dto.token, 
            })).rejects.toThrow(BadRequestException);
        });
    });


    describe('restoreAccount', () => {
        const dto: RestoreAccountDto = {
            userId: "66d434125a960f3fe329a338",
            actionId: "actionId",
            verifyToken: "verifyToken",
            type: "password",
            newValue: "newPassword123",
        };
        
        const mockAction = { id: 'actionId', userId: dto.userId, type: dto.type };
        const mockUser = { 
            _id: dto.userId,
            local: { email: "test@mail.jest", password: "hashedPassword" },
            nick: "jestUser",
        };
    
        beforeEach(() => {
            jest.spyOn(mockModerationsService, 'validateAction').mockResolvedValue(mockAction);
            jest.spyOn(mockUserModel, 'findByIdAndUpdate').mockResolvedValue({
                ...mockUser,
                local: { ...mockUser.local, password: 'newHashedPassword' }
            });
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword');
            jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('someSalt');
        });
    
        it('should successfully restore account with new password', async () => {
            const result = await usersService.restoreAccount(dto);
    
            expect(mockModerationsService.validateAction).toHaveBeenCalledWith({
                userId: dto.userId,
                actionId: dto.actionId,
                verifyToken: dto.verifyToken,
                type: dto.type,
            });
            expect(bcrypt.hash).toHaveBeenCalledWith(dto.newValue, 'someSalt');
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                dto.userId,
                { 'local.password': 'newHashedPassword' }
            );
            expect(mockModerationsService.deleteModeration).toHaveBeenCalledWith({
                actionId: dto.actionId,
                userId: dto.userId,
                type: dto.type == "password" ? "local.password" : dto.type,
                verifyToken: dto.verifyToken,
            });
            expect(result).toEqual({
                action: mockAction,
                user: {
                    ...mockUser,
                    local: { ...mockUser.local, password: 'newHashedPassword' },
                },
            });
        });
    
        it('should throw BadRequestException if action is invalid', async () => {
            jest.spyOn(mockModerationsService, 'validateAction').mockResolvedValue(null);
    
            await expect(usersService.restoreAccount(dto)).rejects.toThrow(BadRequestException);
        });
    
        it('should throw BadRequestException if email is already taken', async () => {
            const emailDto = { ...dto, type: 'email', newValue: 'taken@mail.com' };
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser as any);
    
            await expect(usersService.restoreAccount(emailDto)).rejects.toThrow(
                BadRequestException
            );
        });
    });
    

    describe('prepareAccountToRestore', () => {
        const dto: PrepareToRestoreDto = {
            email: "test@mail.jest",
            type: "password",
        };
        
        const mockUser = { 
            _id: "66d434125a960f3fe329a338",
            local: { email: dto.email },
            nick: "jestUser",
        };
        
        const mockModeration = {
            _id: "moderationId",
            user: mockUser._id,
            type: dto.type,
            verifyToken: "some-verification-token",
        };
    
        beforeEach(() => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser as any);
            jest.spyOn(mockModerationsService, 'createModeration').mockResolvedValue(mockModeration);
            jest.spyOn(mockEmailService, 'sendRestorationEmail').mockResolvedValue(undefined);
        });
    
        it('should prepare account restoration and send email when user is found', async () => {
            const result = await usersService.prepareAccountToRestore(dto);
    
            expect(usersService.getUserByEmail).toHaveBeenCalledWith(dto.email);
            expect(mockModerationsService.createModeration).toHaveBeenCalledWith({
                user: mockUser._id.toString(),
                type: dto.type,
            });
            expect(mockEmailService.sendRestorationEmail).toHaveBeenCalledWith(
                mockUser.local.email,
                mockUser.nick,
                `${process.env.CLIENT_BASE}/account-restore/${mockUser._id}/${mockModeration._id}/${mockModeration.verifyToken}/${dto.type}`
            );
    
            expect(result).toEqual({
                action: mockModeration,
                user: mockUser,
            });
        });
    
        it('should throw BadRequestException when user is not found', async () => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
    
            await expect(usersService.prepareAccountToRestore(dto)).rejects.toThrow(BadRequestException);
        });
    });


    describe('calculateAchievements', () => {
        it('should throw BadRequestException if user is not found', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);
    
            await expect(usersService.calculateAchievements(mockUser._id)).rejects.toThrow(BadRequestException);
        });
    
        it('should return zero achievements and total RP if no posts data is found', async () => {
            jest.spyOn(mockPostsService, 'getPostsLikesAndSavesByOwner').mockResolvedValue([]);
    
            const result = await usersService.calculateAchievements(mockUser._id);
    
            expect(result).toEqual({
                achievements: [],
                totalRP: 0,
                totalLikes: 0,
                totalSaves: 0,
                maxLikesByPost: 0,
                maxSavesByPost: 0,
                postCount: 0,
            });
        });
    });


    describe('Social Media Unlinking', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
        });
    
        describe('unlinkGoogle', () => {
            it('should unlink Google account from the user', async () => {
                await usersService.unlinkGoogle(mockUser._id);
                
                expect(usersService.getUserById).toHaveBeenCalledWith(mockUser._id);
                expect(mockUser.google).toBeNull();
                expect(mockUser.save).toHaveBeenCalled();
            });
    
            it('should throw BadRequestException if user does not exist', async () => {
                jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);
    
                await expect(usersService.unlinkGoogle(mockUser._id)).rejects.toThrow(BadRequestException);
            });
        });
    
        describe('unlinkFacebook', () => {
            it('should unlink Facebook account from the user', async () => {
                await usersService.unlinkFacebook(mockUser._id);

                expect(usersService.getUserById).toHaveBeenCalledWith(mockUser._id);
                expect(mockUser.facebook).toBeNull();
                expect(mockUser.save).toHaveBeenCalled();
            });
    
            it('should throw BadRequestException if user does not exist', async () => {
                jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);
    
                await expect(usersService.unlinkFacebook(mockUser._id)).rejects.toThrow(BadRequestException);
            });
        });
    
        describe('unlinkTwitter', () => {
            it('should unlink Twitter account from the user', async () => {
                await usersService.unlinkTwitter(mockUser._id);

                expect(usersService.getUserById).toHaveBeenCalledWith(mockUser._id);
                expect(mockUser.twitter).toBeNull();
                expect(mockUser.save).toHaveBeenCalled();
            });
    
            it('should throw BadRequestException if user does not exist', async () => {
                jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);
    
                await expect(usersService.unlinkTwitter(mockUser._id)).rejects.toThrow(BadRequestException);
            });
        });
    });


    describe('switchPostInSaved', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
            jest.spyOn(mockPostsService, 'getPostById').mockResolvedValue(mockPost);
        });

        it('should save the post if not already saved', async () => {
            const result = await usersService.switchPostInSaved(mockPost._id, mockUser._id);
            
            expect(mockUser.savedPosts).toContainEqual(mockPost);
            expect(mockPost.saves).toBe(1);
            expect(mockPost.save).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual({ user: mockUser, post: mockPost });
        });

        it('should remove the post from saved if already saved', async () => {
            mockUser.savedPosts.push(mockPost); // Simulate already saved post
            const result = await usersService.switchPostInSaved(mockPost._id, mockUser._id);

            expect(mockUser.savedPosts).not.toContainEqual(mockPost);
            expect(mockPost.saves).toBe(0);
            expect(mockPost.save).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual({ user: mockUser, post: mockPost });
        });
    });


    describe('switchPostInLiked', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
            jest.spyOn(mockPostsService, 'getPostById').mockResolvedValue(mockPost);
        });

        it('should like the post if not liked', async () => {
            const result = await usersService.switchPostInLiked(mockPost._id, mockUser._id);
            
            expect(mockUser.likedPosts).toContainEqual(mockPost);
            expect(mockPost.likes).toBe(1);
            expect(mockPost.save).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual({ user: mockUser, post: mockPost });
        });

        it('should remove like from the post if liked', async () => {
            mockUser.likedPosts.push(mockPost); // Simulate already liked post
            const result = await usersService.switchPostInLiked(mockPost._id, mockUser._id);

            expect(mockUser.likedPosts).not.toContainEqual(mockPost);
            expect(mockPost.likes).toBe(0);
            expect(mockPost.save).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual({ user: mockUser, post: mockPost });
        });
    });

    describe('switchPostPinned', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
            jest.spyOn(mockPostsService, 'getPostById').mockResolvedValue(mockPost);
        });

        it('should add post to pinned posts array and return a user', async() => {
            const result = await usersService.switchPostPinned(mockPost._id, mockUser._id);

            expect(mockUser.pinnedPosts).toContainEqual(mockPost);
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        it('should remove post from pinned posts array and return a user', async() => {
            mockUser.pinnedPosts.push(mockPost); // Simulate already pinned post
            const result = await usersService.switchPostPinned(mockPost._id, mockUser._id);

            expect(mockUser.pinnedPosts).not.toContainEqual(mockPost);
            expect(mockUser.save).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });
    }); 


    describe('getPinnedPosts', () => {
        it('should return a list of user pinned posts', async() => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
            const res1 = await usersService.getPinnedPosts(mockUser._id);
            expect(res1.length).toBe(0);

            mockUser.pinnedPosts.push(mockPost);
            const res2 = await usersService.getPinnedPosts(mockUser._id);
            expect(res2.length).toBe(1);
            expect(usersService.getUserById).toHaveBeenCalledWith(mockUser._id);
        });
    }); 


    describe('linkEmailRequest', () => {
        const newEmail = 'test@abc.com';
        const mockModeration = {
            _id: "moderationId",
            user: mockUser._id,
            type: "link-email",
            verifyToken: "some-verification-token",
        };

        it('should send an email linking request and create a moderation action', async() => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
            jest.spyOn(mockModerationsService, 'createModeration').mockResolvedValue(mockModeration);
            
            await usersService.linkEmailRequest(newEmail, mockUser._id);

            expect(usersService.getUserById).toHaveBeenCalledWith(mockUser._id);
            expect(usersService.getUserByEmail).toHaveBeenCalledWith(newEmail);
            expect(mockModerationsService.createModeration).toHaveBeenLastCalledWith({
                user: mockUser._id,
                type: "link-email",
            });
        });

        it('should throw BadRequestException on user not found', async() => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);
            await expect(usersService.linkEmailRequest(newEmail, mockUser._id)).rejects.toThrow(BadRequestException);;
        });

        it('should throw BadRequestException on user by email was found', async() => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser as any);
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser as any);

            await expect(usersService.linkEmailRequest(newEmail, mockUser._id)).rejects.toThrow(BadRequestException);;
        });
    });
});
