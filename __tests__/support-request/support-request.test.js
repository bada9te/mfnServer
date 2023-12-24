const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../src/app");
const data = require("../testData");
const {
    SUPPORT_REQUEST_QUERY, 
    SUPPORT_REQUESTS_QUERY,
    SUPPORT_REQUEST_CREATE_MUTATION,
} = require("./support-request.gql");

const GQL_PATH = '/graphql';


describe("Support-request tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    it("Create support-request", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(SUPPORT_REQUEST_CREATE_MUTATION({
                contactReason: "test reason",
                email: data.user.email,
                message: "test message",
            }));
        data.supportRequest._id = body.data.supportRequestCreate._id;
        expect(statusCode).toBe(200);
        expect(body.data.supportRequestCreate).toBeTruthy(); 
    }); 

    it("Get support-request by id", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(SUPPORT_REQUEST_QUERY(data.supportRequest._id));
        expect(statusCode).toBe(200);
        expect(body.data.supportRequest._id).toBe(data.supportRequest._id);
    });

    it("Get many support requests, expecting in case one support-request", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(SUPPORT_REQUESTS_QUERY(0, 12));
        expect(statusCode).toBe(200);
        expect(body.data.supportRequests.length).not.toBe(0);
    });
});
