import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "./users.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ModerationsService } from "../moderations/moderations.service";
import { EmailService } from "src/utils/email/email.service";
import { PostsService } from "../posts/posts.service";
import { AchievementsService } from "../achievements/achievements.service";
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
    let usersService: UsersService;
    let model: Model<User>;

    const mockUser = {
        _id: "66d434125a960f3fe329a338",
        local: {
            email: "test@mail.jest",
        },
        nick: "jestUser",
    };

    const mockUserModel = {
        findById: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
    };

    // Mock for dependencies
    const mockModerationsService = {
        createModeration: jest.fn().mockResolvedValue({
            _id: "111004125a960f3fe329a999",
            type: "jest-test-type",
            verifyToken: "jest-verify-test-token"
        }),
    };
    const mockEmailService = {
        sendVerificationEmail: jest.fn().mockImplementation(
            () => Promise.resolve()
        ),
    };
    const mockPostsService = {};
    const mockAchievementsService = {};

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
            jest
                .spyOn(model, 'create')
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
});
