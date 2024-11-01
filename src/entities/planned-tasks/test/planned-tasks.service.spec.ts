import { Model } from "mongoose";
import { PlannedTasksService } from "../planned-tasks.service";
import { PlannedTask } from "../planned-tasks.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

describe('PlannedTasksService', () => {
    let plannedTasksService: PlannedTasksService;
    let model: Model<PlannedTask>;

    const mockPlannedTask = {
        _id: "planned-task-id",
        relatedEntityId: "test-id",
        date: new Date().toDateString(),
        taskType: "unknown" as any,
    };

    const mockPlannedTasksModel = {
        create: jest.fn(),
        findOneAndDelete: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlannedTasksService,
                { provide: getModelToken(PlannedTask.name), useValue: mockPlannedTasksModel },
            ],
        }).compile();

        plannedTasksService = module.get<PlannedTasksService>(PlannedTasksService);
        model = module.get<Model<PlannedTask>>(getModelToken(PlannedTask.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPlannedTask', () => {
        it('should create and return planned task', async() => {
            jest.spyOn(model, 'create').mockImplementation(() => Promise.resolve(mockPlannedTask as any));

            const input = {
                relatedEntityId: "test-id",
                date: new Date().toDateString(),
                taskType: "unknown" as any,
            };

            const res = await plannedTasksService.createPlannedTask(input);
            expect(model.create).toHaveBeenCalledWith(input);
            expect(res).toEqual(mockPlannedTask);
        });
    });

    describe('deletePlannedTask', () => {
        it('should delete planned task by relatedEntityId + taskType and return it', async() => {
            jest.spyOn(model, 'findOneAndDelete').mockResolvedValue(mockPlannedTask);

            const res = await plannedTasksService.deletePlannedTask(mockPlannedTask.taskType, mockPlannedTask.relatedEntityId);
            expect(model.findOneAndDelete).toHaveBeenCalledWith(
                {
                    taskType: mockPlannedTask.taskType,
                    relatedEntityId: mockPlannedTask.relatedEntityId
                }
            );
            expect(res).toEqual(mockPlannedTask);
        });
    });

    describe('getAllTasks', () => {
        it('should find and return all planned tasks', async() => {
            jest.spyOn(model, 'find').mockResolvedValue([mockPlannedTask]);

            const res = await plannedTasksService.getAllTasks();
            expect(model.find).toHaveBeenCalled();
            expect(res).toEqual([mockPlannedTask]);
        });
    });
});