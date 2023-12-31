const mongoose = require("mongoose");
const data = require("../testData");
const request = require("supertest");
const app = require("../../src/app");
const { BATTLE_CREATE_MUTATION, BATTLES_BY_STATUS_QUERY, BATTLE_MAKE_VOTE_MUTATION, BATTLE_DELETE_BY_ID_MUTATION } = require("./battle.gql");


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
        const battleCreate = body.data.battleCreate;
        data.battle._id = battleCreate._id;
        expect(statusCode).toBe(200);
        expect(battleCreate.post1._id).toBe(data.post1._id.toString());
        expect(battleCreate.post2._id).toBe(data.post2._id.toString());
    });

    it("Get battles by status (running)", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(BATTLES_BY_STATUS_QUERY("running", 0, 12));
        expect(statusCode).toBe(200);
        expect(body.data.battlesByStatus.battles.length).not.toBe(0); 
    });

    it("Make battle vote", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(BATTLE_MAKE_VOTE_MUTATION({
                battleId: data.battle._id,
                postNScore: "post1Score",
                voteCount: 1,
                voterId: data.user._id,
            }));
        const battle = body.data.battleMakeVote;
        expect(statusCode).toBe(200);
        expect(battle._id).toBe(data.battle._id.toString());
        expect(battle.post1Score).toBe(1);
        expect(battle.post2Score).toBe(0);
    });

    it("Delete battle by id", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(BATTLE_DELETE_BY_ID_MUTATION(data.battle._id));
        expect(statusCode).toBe(200);
        expect(body.data.battleDeleteById._id).toBe(data.battle._id.toString());
    });
});