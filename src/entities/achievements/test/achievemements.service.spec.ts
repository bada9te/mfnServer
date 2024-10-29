import { Model } from "mongoose";
import { AchievementsService } from "../achievements.service";
import { Achievement } from "../achievements.schema";
import { Test } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

describe('AchievementsService', () => {
    let achievementsService: AchievementsService;
    let model: Model<Achievement>;
    
    const mockAchievement = {
        _id: "44d434125a778f3fe329a330",
        achievement: "tesTTTT",
        description: "descrTTT",
        type: "basic",
        rarity: "legendary",
        posNumber: 4,
        rp: 100,
    };

    const mockAchievementsModel = {
        find: jest.fn(),
        insertMany: jest.fn(),
    };


    beforeEach(async() => {
        const module = await Test.createTestingModule({
            providers: [
                AchievementsService,
                { provide: getModelToken(Achievement.name), useValue: mockAchievementsModel }
            ]
        }).compile();
        
        achievementsService = module.get<AchievementsService>(AchievementsService);
        model = module.get<Model<Achievement>>(getModelToken(Achievement.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllAchievements', () => {
        it('should return a list of achievements', async() => {
            jest.spyOn(model, 'find').mockResolvedValue([mockAchievement]);

            const res = await achievementsService.getAllAchievements();
            expect(res).toEqual([mockAchievement]);
        });
    });

    describe('achievementsByIds', () => {
        it('should return a list of achievements by ids', async() => {
            jest.spyOn(model, 'find').mockResolvedValue([mockAchievement]);

            const res = await achievementsService.achievementsByIds([mockAchievement._id]);
            expect(model.find).toHaveBeenCalledWith({ _id: [mockAchievement._id] });
            expect(res).toEqual([mockAchievement]);
        });
    });

    describe('achievementsByPos', () => {
        it('should return a list of achievements by pos', async() => {
            jest.spyOn(model, 'find').mockResolvedValue([mockAchievement]);

            const res = await achievementsService.achievementsByPos([mockAchievement.posNumber]);
            expect(model.find).toHaveBeenCalledWith({ posNumber: [mockAchievement.posNumber] });
            expect(res).toEqual([mockAchievement]);
        });
    });

    describe('insertAchievements', () => {
        it('should insert an array of achievements into collection', async() => {
            jest.spyOn(model, 'insertMany').mockImplementation(() => Promise.resolve([mockAchievement] as any));

            const res = await achievementsService.insertAchievements([mockAchievement]);
            expect(model.insertMany).toHaveBeenCalledWith([mockAchievement]);
            expect(res).toEqual([mockAchievement]);
        });
    });
});