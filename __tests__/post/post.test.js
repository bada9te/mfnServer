const mongoose = require("mongoose");
const request = require("supertest");
const data = require("../testData");
const { POST_CREATE_MUTATION, POST_BY_ID_QUERY, POSTS_QUERY, POSTS_BY_OWNER_QUERY } = require("./post.gql");
const app = require("../../src/app");


const GQL_PATH = '/graphql';


describe("Post tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    // create
    it("Post create", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POST_CREATE_MUTATION({
                owner: data.user._id,
                title: "test",
                description: "test",
                audio: "test_url",
                image: "test_url",
                commentsAllowed: true,
                downloadsAllowed: false,
            }));
        data.post1._id = body.data.postCreate._id;
        expect(statusCode).toBe(200);
        expect(body.data.postCreate.owner._id).toBe(data.user._id.toString());
    });

    // get by id
    it("Get post by id", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POST_BY_ID_QUERY(data.post1._id));
        expect(statusCode).toBe(200);
        expect(body.data.post._id).toBe(data.post1._id.toString());
    });

    // get many
    it("Get many posts", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(POSTS_QUERY(0, 12));
        expect(statusCode).toBe(200);
        expect(body.data.posts.posts.length).not.toBe(0);
    });

    // get by owner
    it("Get posts by owner", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POSTS_BY_OWNER_QUERY(data.user._id, 0, 12));
        expect(statusCode).toBe(200);
        expect(body.data.postsByOwner.posts.length).not.toBe(0);
    });


});
