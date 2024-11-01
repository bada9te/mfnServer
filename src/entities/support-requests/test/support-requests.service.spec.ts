import { Model } from "mongoose";
import { SupportRequestsService } from "../support-requests.service";
import { SupportRequest } from "../support-requests.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

describe('SupportRequestsService', () => {
    let supportRequestsService: SupportRequestsService;
    let model: Model<SupportRequest>;

    const mockSupportRequest = {
        _id: "66d434125a960f3fe329a338",
        email: "test@mail.jest",
    };

    const mockSupportRequestModel = {
        create: jest.fn(),
        find: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SupportRequestsService,
                { provide: getModelToken(SupportRequest.name), useValue: mockSupportRequestModel },
            ]
        }).compile();

        supportRequestsService = module.get<SupportRequestsService>(SupportRequestsService);
        model = module.get<Model<SupportRequest>>(getModelToken(SupportRequest.name));
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createSupportRequest', () => {
        it('should create and return support request', async () => {
            jest.spyOn(model, 'create').mockImplementation(() => Promise.resolve(mockSupportRequest as any));
            const newReq = {
                contactReason: "test",
                email: "test@mail.test",
                message: "jest-msg",
            }
            const res = await supportRequestsService.createSupportRequest(newReq);

            expect(model.create).toHaveBeenCalledWith(newReq);
            expect(res).toEqual(mockSupportRequest);
        });
    });

    describe('getAllSupportRequsts', () => {
        it('should return a list of support requests', async () => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: jest.fn().mockResolvedValue([mockSupportRequest]),
                }),
            } as any));

            const res = await supportRequestsService.getAllSupportRequsts({
                offset: 0,
                limit: 6,
            });

            expect(res).toEqual([mockSupportRequest]);
        });
    });

    describe('closeSupportRequest', () => {
        it('should update support request', async() => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockSupportRequest);

            const res = await supportRequestsService.closeSupportRequest(mockSupportRequest._id);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
                mockSupportRequest._id,
                { isClosed: true },
                { new: true, upsert: true }
            );
            expect(res).toEqual(mockSupportRequest);
        });
    });

    describe('getSupportRequestById', () => {
        it('should return a support-request by id', async() => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockSupportRequest);

            const res = await supportRequestsService.getSupportRequestById(mockSupportRequest._id);
            expect(model.findById).toHaveBeenCalledWith(mockSupportRequest._id);
            expect(res).toEqual(mockSupportRequest);
        });
    });
});