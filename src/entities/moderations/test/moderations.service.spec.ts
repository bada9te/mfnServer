import { Model } from "mongoose";
import { ModerationsService } from "../moderations.service";
import { Moderation } from "../moderations.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";


describe('ModerationsService', () => {
    let moderationsService: ModerationsService;
    let model: Model<Moderation>;

    const mockModeration = {
        _id: "00x434125a999f3fe329a338",
        user: "66d434125a960f3fe329a338",
        type: "test",
        verifyToken: "token-123",
    };

    const mockModerationModel = {
        create: jest.fn(),
        findOneAndDelete: jest.fn(),
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ModerationsService,
                { provide: getModelToken(Moderation.name), useValue: mockModerationModel }
            ]
        }).compile();

        moderationsService = module.get<ModerationsService>(ModerationsService);
        model = module.get<Model<Moderation>>(getModelToken(Moderation.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('createModeration', () => {
        it('should create and return the moderation', async() => {
            jest.spyOn(model, 'create').mockImplementation(() => Promise.resolve(mockModeration as any));
            
            const res = await moderationsService.createModeration(mockModeration);
            expect(res).toEqual(mockModeration);
        });
    });

    describe('deleteModeration', () => {
        it('should find and delete moderation', async() => {
            jest.spyOn(model, 'findOneAndDelete').mockResolvedValue(mockModeration);

            const res = await moderationsService.deleteModeration({
                actionId: mockModeration._id,
                userId: mockModeration.user,
                type: mockModeration.type,
                verifyToken: mockModeration.verifyToken
            });

            expect(model.findOneAndDelete).toHaveBeenCalledWith({
                _id: mockModeration._id,
                user: mockModeration.user,
                type: mockModeration.type,
                verifyToken: mockModeration.verifyToken
            });
            expect(res).toEqual(mockModeration);
        });
    });

    describe('validateAction', () => {
        it('should find and validate moderation (verifies that moderation-action exist)', async() => {
            jest.spyOn(model, 'findOne').mockResolvedValue(mockModeration);

            const res = await moderationsService.validateAction({
                actionId: mockModeration._id,
                userId: mockModeration.user,
                type: mockModeration.type,
                verifyToken: mockModeration.verifyToken
            });

            expect(model.findOne).toHaveBeenCalledWith({
                _id: mockModeration._id,
                user: mockModeration.user,
                type: mockModeration.type,
                verifyToken: mockModeration.verifyToken
            });
            expect(res).toEqual(mockModeration);
        });
    });

});