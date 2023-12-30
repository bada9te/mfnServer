const mongoose = require("mongoose");
const data = require("../testData");
const request = require("supertest");
const app = require("../../src/app");
const { MODERATION_ACTION_VALIDATE_QUERY, MODERATION_ACTION_CREATE_MUTATION, MODERATION_ACTION_DELETE_MUTATION } = require("./moderation.gql");


const GQL_PATH = '/graphql';

describe("Moderation tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    // create
    it("Create action", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(MODERATION_ACTION_CREATE_MUTATION({
                user: data.user._id,
                type: "password"
            }));
        const modAction = body.data.moderationActionCreate;
        data.moderationAction._id = modAction._id;
        data.moderationAction.verifyToken = modAction.verifyToken;
        expect(statusCode).toBe(200);
        expect(modAction.type).toBe("password");
    });

    // validate
    it("Validate action", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(MODERATION_ACTION_VALIDATE_QUERY({
                userId: data.user._id,
                actionId: data.moderationAction._id,
                type: "password",
                verifyToken: data.moderationAction.verifyToken,
            }));
            
        expect(statusCode).toBe(200);
        expect(body.data.moderationActionValidate.type).toBe("password");
    });

    // delete
    it("Delete action", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(MODERATION_ACTION_DELETE_MUTATION({
                userId: data.user._id,
                actionId: data.moderationAction._id,
                type: "password",
                verifyToken: data.moderationAction.verifyToken,
            }));
        expect(statusCode).toBe(200);
        expect(body.data.moderationActionDelete.type).toBe("password");
    });
});