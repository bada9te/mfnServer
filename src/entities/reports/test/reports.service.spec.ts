import { Model } from "mongoose";


import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Report } from "../reports.schema";
import { ReportsService } from "../reports.service";
import { PostsService } from "src/entities/posts/posts.service";
import { NotificationsService } from "src/entities/notifications/notifications.service";

describe('ReportsService', () => {
    let reportsService: ReportsService;
    let model: Model<Report>;

    const mockReport = {
        _id: "66d434125a960f3fe329a338",
        email: "test@mail.jest",
        contactReason: "test",
        message: "test-msg",
    };

    const mockReportModel = {
        create: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findById: jest.fn(),
    };
    
    const mockNotificationsService = {
        createNotification: jest.fn(),
    }
   
    const mockPostsService = {
        getPostsLikesAndSavesByOwner: jest.fn(),
        getAllAchievements: jest.fn(),
        getPostById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReportsService,
                { provide: getModelToken(Report.name), useValue: mockReportModel },
                { provide: PostsService, useValue: mockPostsService },
                { provide: NotificationsService, useValue: mockNotificationsService },
            ]
        }).compile();

        reportsService = module.get<ReportsService>(ReportsService);
        model = module.get<Model<Report>>(getModelToken(Report.name));
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createReport', () => {
        it('should create and return report', async () => {
            jest.spyOn(model, 'create').mockImplementation(() => Promise.resolve(mockReport as any));
            const newReq = {
                contactReason: "test",
                message: "test-msg",
            }
            const res = await reportsService.createReport(newReq);

            expect(model.create).toHaveBeenCalledWith(newReq);
            expect(res).toEqual(mockReport);
        });
    });

    describe('getAllReports', () => {
        it('should return a list of reports', async () => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: jest.fn().mockResolvedValue([mockReport]),
                }),
            } as any));

            const res = await reportsService.getAllReports({
                offset: 0,
                limit: 6,
            });

            expect(res).toEqual([mockReport]);
        });
    });

    describe('closeReport', () => {
        it('should update support request', async() => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockReport);

            const res = await reportsService.closeReport(mockReport._id);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
                mockReport._id,
                { isClosed: true },
                { new: true, upsert: true }
            );
            expect(res).toEqual(mockReport);
        });
    });

    describe('getSupportRequestById', () => {
        it('should return a support-request by id', async() => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockReport);

            const res = await reportsService.getReportById(mockReport._id);
            expect(model.findById).toHaveBeenCalledWith(mockReport._id);
            expect(res).toEqual(mockReport);
        });
    });
});