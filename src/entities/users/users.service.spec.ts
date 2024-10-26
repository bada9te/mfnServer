import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { User } from "./users.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ModerationsService } from "../moderations/moderations.service";
import { EmailService } from "src/utils/email/email.service";
import { PostsService } from "../posts/posts.service";
import { AchievementsService } from "../achievements/achievements.service";

describe('UsersService', () => {
    let usersService: UsersService;
    let model: Model<User>;

    const mockUser = {
        _id: "66d434125a960f3fe329a338",
    };

    const mockUserModel = {
        findById: jest.fn().mockResolvedValue(mockUser),
    };

    // Mock for dependencies
    const mockModerationsService = {};
    const mockEmailService = {};
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
    });

    describe('getUserById', () => {
        it('should find and return a user by id', async () => {
            const res = await usersService.getUserById(mockUser._id);

            expect(model.findById).toHaveBeenCalledWith(mockUser._id);
            expect(res).toEqual(mockUser);
        });
    });
});
