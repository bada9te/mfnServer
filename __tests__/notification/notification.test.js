const mongoose = require("mongoose");
const data = require("../testData");
const request = require("supertest");
const app = require("../../src/app");
const { NOTIFICATION_CREATE_MUTATION, NOTIFICATION_MARK_AS_READ_BY_ID, NOTIFICATION_DELETE_BY_ID, NOTIFICATIONS_DELETE_BY_IDS, NOTIFICATIONS_MARK_AS_READ_BY_IDS } = require("./notification.gql");




const GQL_PATH = '/graphql';


describe("Notification tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    describe("Using single", () => {
        // create
        it("Create notification", async() => {
            const { statusCode, body } = await request(app)
                .post(GQL_PATH)
                .send(NOTIFICATION_CREATE_MUTATION({
                    receiver: data.user._id,
                    sender: data.secondUser._id,
                    post: data.post1._id,
                    text: "Check this!",
                }));
            const notification = body.data.notificationCreate;
            data.notification._id = notification._id;
            expect(statusCode).toBe(200);
            expect(notification.receiver._id).toBe(data.user._id.toString());
            expect(notification.sender._id).toBe(data.secondUser._id.toString());
            expect(notification.text).toBe("Check this!");
        });

        // read
        it("Mark as read by id", async() => {
            const { statusCode, body } = await request(app)
                .post(GQL_PATH)
                .send(NOTIFICATION_MARK_AS_READ_BY_ID(data.notification._id));
            expect(statusCode).toBe(200);
            expect(body.data.notificationMarkAsReadById.checked).toBeTruthy();
        });

        // delete
        it("Delete by id", async() => {
            const { statusCode, body } = await request(app)
                .post(GQL_PATH)
                .send(NOTIFICATION_DELETE_BY_ID(data.notification._id));
            expect(statusCode).toBe(200);
            expect(body.data.notificationDeleteById._id).toBe(data.notification._id);
        });
    });

    describe("Using multiple", () => {
        // create
        it("Create notification", async() => {
            const { statusCode, body } = await request(app)
                .post(GQL_PATH)
                .send(NOTIFICATION_CREATE_MUTATION({
                    receiver: data.user._id,
                    sender: data.secondUser._id,
                    post: data.post1._id,
                    text: "Check this!",
                }));
            const notification = body.data.notificationCreate;
            data.notification._id = notification._id;
            expect(statusCode).toBe(200);
            expect(notification.receiver._id).toBe(data.user._id.toString());
            expect(notification.sender._id).toBe(data.secondUser._id.toString());
            expect(notification.text).toBe("Check this!");
        });

        // read
        it("Mark as read by ids", async() => {
            const { statusCode, body } = await request(app)
                .post(GQL_PATH)
                .send(NOTIFICATIONS_MARK_AS_READ_BY_IDS([data.notification._id]));
                console.log(body)
            expect(statusCode).toBe(200);
            expect(body.data.notificationsMarkAsReadByIds.count).not.toBe(0)
        });

        // delete
        it("Delete by ids", async() => {
            const { statusCode, body } = await request(app)
                .post(GQL_PATH)
                .send(NOTIFICATIONS_DELETE_BY_IDS([data.notification._id]));
            expect(statusCode).toBe(200);
            expect(body.data.notificationsDeleteByIds.count).not.toBe(0);
        });
    });
});