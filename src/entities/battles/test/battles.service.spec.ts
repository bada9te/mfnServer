import { Model } from "mongoose";
import { BattlesService } from "../battles.service";
import { Battle } from "../battles.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { TasksService } from "../utils/tasks/tasks.service";
import { NotificationsService } from "../entities/notifications/notifications.service";
import { PostsService } from "../entities/posts/posts.service";

describe('BattlesService', () => {
    let battlesService: BattlesService;
    let model: Model<Battle>;

    const mockBattle = {
        _id: "ajldjhwaLJDWAL",
        title: "test",
        chainId: 10,
        initiator: {
            _id: "a",
        },
        post1: {
            _id: "b",
            owner: {
                _id: "ajodjwad",
            }
        },
        post2: {
            _id: "c",
            owner: {
                _id: "1j2djwad",
            }
        },
        post1Score: 0,
        post2Score: 1,
        winner: null,
        willFinishAt: new Date(),
        finished: false,
        votedBy: [],
    };

    const mockBattlesModel = {
        insertMany: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        find: jest.fn(),
        findOneAndUpdate: jest.fn(),
    };

    const mockTasksService = {
        addCronJob: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    const mockNotificationsService = {
        createManyNotifications: jest.fn().mockImplementation(() => Promise.resolve()),
    };

    const mockPostsService = {
        getManyByIds: jest.fn().mockResolvedValue([
            { _id: "a", owner: { _id: "ddd" } }, 
            { _id: "b", owner: { _id: "ddd" } },
        ]),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BattlesService,
                { provide: getModelToken(Battle.name), useValue: mockBattlesModel },
                { provide: TasksService, useValue: mockTasksService },
                { provide: NotificationsService, useValue: mockNotificationsService },
                { provide: PostsService, useValue: mockPostsService },
            ],
        }).compile();

        battlesService = module.get<BattlesService>(BattlesService);
        model = module.get<Model<Battle>>(getModelToken(Battle.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addBattleByIds', () => {
        it('should create a battle by posts ids', async() => {
            jest.spyOn(model, 'insertMany').mockImplementation(() => Promise.resolve([mockBattle]) as any);
            
            const input = {
                title: "abc",
                post1: "a",
                post2: "b",
                initiator: "c",
            };
            const res = await battlesService.addBattleByIds(input);
            expect(model.insertMany).toHaveBeenCalled();
            expect(res).toEqual(mockBattle);
        });
    });

    describe('getBattleById', () => {
        it('should find and return battle by id', async() => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockBattle);

            const res = await battlesService.getBattleById(mockBattle._id);
            expect(model.findById).toHaveBeenCalledWith(mockBattle._id);
            expect(res).toEqual(mockBattle);
        });
    });

    describe('deleteBattle', () => {
        it('should find and delete battle by id', async() => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBattle);

            const res = await battlesService.deleteBattle(mockBattle._id);
            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBattle._id);
            expect(res).toEqual(mockBattle);
        });
    });

    describe('setWinnerByBattleId', () => {
        it('should set winner of the battle', async() => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockBattle);
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockBattle);

            const res = await battlesService.setWinnerByBattleId(mockBattle._id);
            expect(model.findById).toHaveBeenCalledWith(mockBattle._id);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
                mockBattle._id,
                {
                    $set: {
                        winner: mockBattle.post2,
                        finished: true,
                    }
                },
                { new: true }
            );
            expect(res).toEqual(mockBattle);
        });
    });

    describe('getAllBattlesByStatus', () => {
        it('should find all battles by status', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        populate: () => ({
                            populate: () => ({
                                sort: jest.fn().mockResolvedValue([mockBattle]),
                            }),
                        }),
                    }),
                }),
            } as any));

            const res = await battlesService.getAllBattlesByStatus(
                true, 
                { offset: 0, limit: 6 }
            );

            expect(model.find).toHaveBeenCalledWith({ finished: true });
            expect(res).toEqual([mockBattle]);
        });
    });

    describe('updateScore', () => {
        it('should find battle and update score', async() => {
            jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(mockBattle);

            const input = {
                battleId: "a",
                postNScore: "1",
                voteCount: 1,
                voterId: "b",
            };

            const res = await battlesService.updateScore(input);
            expect(model.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: input.battleId }, 
                { 
                    $inc: { [input.postNScore]: input.voteCount },
                    $push: { votedBy: input.voterId },
                },
                { new: true }
            );
            expect(res).toEqual(mockBattle);
        }); 
    });

    describe('getBattlesUserParticipatedIn', () => {
        it('should find and return a list of battles related to user', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        sort: jest.fn().mockResolvedValue([mockBattle]),
                    }),
                }),
            } as any));

            const res = await battlesService.getBattlesUserParticipatedIn(
                mockBattle.initiator._id, 
                { offset: 0, limit: 6 }
            );
            expect(model.find).toHaveBeenCalledWith({
                $or: [{ initiator: mockBattle.initiator._id }, { votedBy: mockBattle.initiator._id }]
            });
            expect(res).toEqual([mockBattle]);
        });
    });
});