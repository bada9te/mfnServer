const mongoose = require("mongoose");
const request = require("supertest");
const data = require("../testData");
const { POST_CREATE_MUTATION, POST_BY_ID_QUERY, POSTS_QUERY, POSTS_BY_OWNER_QUERY, POSTS_BY_TITLE_QUERY, POSTS_BY_IDS_QUERY, POST_UPDATE_MUTATION, POST_SWICTH_LIKE_MUTATION, POST_SWITCH_IN_SAVED_MUTATION, POST_DELETE_MUTATION } = require("./post.gql");
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

    // get by title
    it("Get posts by title", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POSTS_BY_TITLE_QUERY({
                title: "test",
                userId: data.user._id,
                userIsOwner: true
            }));
        expect(statusCode).toBe(200);
        expect(body.data.postsByTitle.length).not.toBe(0);
    });

    // get by ids
    it("Get posts by ids", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POSTS_BY_IDS_QUERY([data.post1._id]));
        expect(statusCode).toBe(200);
        expect(body.data.postsByIds.length).not.toBe(0);
    });

    // update post
    it("Update post", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POST_UPDATE_MUTATION({
                post: data.post1._id,
                what: "title",
                value: "test1",
            }));
        expect(statusCode).toBe(200);
        expect(body.data.postUpdate._id).toBe(data.post1._id.toString());
        expect(body.data.postUpdate.title).toBe("test1");
    });

    // swicth like
    it("Set as liked", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POST_SWICTH_LIKE_MUTATION({
                userId: data.user._id,
                postId: data.post1._id,
            }));
        expect(statusCode).toBe(200);
        expect(body.data.postSwitchLike.likedBy).toContainEqual({"_id": data.user._id.toString()});
    });

    // switch in saved
    it("Swicth in saved", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POST_SWITCH_IN_SAVED_MUTATION({
                userId: data.user._id,
                postId: data.post1._id,
            }));
        expect(statusCode).toBe(200);
        expect(body.data.postSwicthInSaved.savedBy).toContainEqual({"_id": data.user._id.toString()});
    });

    it("Delete post", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(POST_DELETE_MUTATION(data.post1._id));
        expect(statusCode).toBe(200);
        expect(body.data.postDeleteById._id).toBe(data.post1._id.toString());
    });
});
