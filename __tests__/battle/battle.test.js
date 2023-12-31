const mongoose = require("mongoose");
const data = require("../testData");
const request = require("supertest");
const app = require("../../src/app");
const { BATTLE_CREATE_MUTATION } = require("./battle.gql");


const GQL_PATH = '/graphql';


describe("Battle tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    it("Create battle", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(BATTLE_CREATE_MUTATION({
                title: "test",
                post1: data.post1._id,
                post2: data.post2._id,
            }));
            console.log(body)
        const battleCreate = body.data.battleCreate;
        data.battle._id = battleCreate._id;
        expect(statusCode).toBe(200);
        expect(battleCreate.post1._id).toBe(data.post1._id.toString());
        expect(battleCreate.post2._id).toBe(data.post2._id.toString());
    });
});