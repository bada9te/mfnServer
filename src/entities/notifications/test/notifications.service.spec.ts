import { Model } from "mongoose";
import { NotificationsService } from "../notifications.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Notification } from "../notifications.schema";

describe('NotificationsService', () => {
    let notificationsService: NotificationsService;
    let model: Model<Notification>;

    const mockNotification = {
        _id: "55d434166a778f3fg329a330",
        receiver: {
            _id: "44d434125a778f3fe329a330",
        },
        sender: {
            _id: "64d454125aaa8f3feb29a330",
        },
        type: "SUBSCRIBED",
        text: "text-test",
        checked: false,
    };

    const mockNotificationsModel = {
        create: jest.fn(),
        findByIdAndDelete: jest.fn(),
        deleteMany: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        updateMany: jest.fn(),
        find: jest.fn(),
        insertMany: jest.fn(),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                { provide: getModelToken(Notification.name), useValue: mockNotificationsModel },
            ],
        }).compile();

        notificationsService = module.get<NotificationsService>(NotificationsService);
        model = module.get<Model<Notification>>(getModelToken(Notification.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('createNotification', () => {
        it('should create and return notification', async() => {
            jest.spyOn(model, 'create').mockImplementation(() => Promise.resolve(mockNotification as any));

            const input = {
                receiver: mockNotification.receiver._id,
                sender: mockNotification.sender._id,
                battle: "test-battle-ID",
                text: "test-text",
                type: "TEST",
            };
            const res = await notificationsService.createNotification(input);
            expect(model.create).toHaveBeenCalledWith(input);
            expect(res).toEqual(mockNotification);
        });
    });

    describe('deleteNotificationById', () => {
        it('should find and delete notification by id', async() => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockNotification);

            const res = await notificationsService.deleteNotificationById(mockNotification._id);
            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockNotification._id);
            expect(res).toEqual(mockNotification);
        });
    });

    describe('deleteNotificationsByIds', () => {
        it('should delete many notifications by ids array', async() => {
            jest.spyOn(model, 'deleteMany').mockImplementation(() => Promise.resolve() as any);

            const res = await notificationsService.deleteNotificationsByIds([mockNotification._id]);
            expect(model.deleteMany).toHaveBeenCalledWith({ _id: [mockNotification._id] });
            expect(res).toBe(undefined);
        });
    });

    describe('markNotificationAsRead', () => {
        it('should mark notification as read', async() => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockNotification);

            const res = await notificationsService.markNotificationAsRead(mockNotification._id);
            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
                mockNotification._id,
                { checked: true },
                { new: true, upsert: true }
            );
            expect(res).toEqual(mockNotification);
        });
    });

    describe('markNotificationsAsRead', () => {
        it('should mark many notifications as read', async() => {
            jest.spyOn(model, 'updateMany').mockImplementation(() => Promise.resolve() as any);

            const res = await notificationsService.markNotificationsAsRead([mockNotification._id]);
            expect(model.updateMany).toHaveBeenCalledWith(
                { _id: [mockNotification._id] },
                { checked: true },
                { upsert: true }
            );
            expect(res).toBe(undefined);
        });
    });

    describe('getAllUnreadNotifications', () => {
        it('should return a list of unread notifications', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: jest.fn().mockResolvedValue([mockNotification]),
                }),
            } as any));

            const res = await notificationsService.getAllUnreadNotifications(mockNotification.receiver._id, 0, 6);
            expect(model.find).toHaveBeenCalledWith({
                receiver: mockNotification.receiver._id,
                checked: false,
            });
            expect(res).toEqual([mockNotification]);
        });
    });

    describe('getAllReadNotifications', () => {
        it('should return a list of read notifications', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: jest.fn().mockResolvedValue([mockNotification]),
                }),
            } as any));

            const res = await notificationsService.getAllUnreadNotifications(mockNotification.receiver._id, 0, 6);
            expect(model.find).toHaveBeenCalledWith({
                receiver: mockNotification.receiver._id,
                checked: false,
            });
            expect(res).toEqual([mockNotification]);
        });
    });

    describe('getAllNotificationsByIds', () => {
        it('should find and return a list of notifications by ids', async() => {
            jest.spyOn(model, 'find').mockResolvedValue([mockNotification]);

            const res = await notificationsService.getAllNotificationsByIds([mockNotification._id]);
            expect(model.find).toHaveBeenCalledWith({ _id: [mockNotification._id] });
            expect(res).toEqual([mockNotification]);
        });
    });

    describe('createManyNotifications', () => {
        it('should create and return notifications', async() => {
            jest.spyOn(model, 'insertMany').mockResolvedValue([mockNotification] as any);

            const input = {
                from: "from-id",
                text: "test-text",
                to: ["to-id"],
                relatedEntityId: "related-id",
                type: "SUBSCRIBED" as any,
                entityType: "post" as any,
            };

            const calldata = input.to.map(i => {
                const data = {
                    sender: input.from,
                    receiver: i,
                    type: input.type,
                }
    
                if (input.relatedEntityId && input.entityType) {
                    data[input.entityType] = input.relatedEntityId;
                }
    
                return data;
            });

            const res = await notificationsService.createManyNotifications(input);
            expect(model.insertMany).toHaveBeenCalledWith(calldata);
            expect(res).toEqual([mockNotification]);
        });
    });
});