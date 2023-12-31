const mongoose = require("mongoose");
const data = require("../testData");
const request = require("supertest");
const app = require("../../src/app");
const { COMMENT_CREATE_MUTATION, COMMENT_QUERY, COMMENTS_BY_IDS_QUERY, COMMENT_REPLIES_BY_ID_QUERY, COMMENTS_BY_POST_ID_QUERY, COMMENT_DELETE_BY_ID_MUTATION } = require("./comment.gql");


const GQL_PATH = '/graphql';


describe("Comment tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    it("Comment create", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(COMMENT_CREATE_MUTATION({
                owner: data.user._id,
                receiver: data.secondUser._id,
                text: "test",
                isReply: false,
                //isReplyTo: ID,
                post: data.post1._id,
            }));
        const comment = body.data.commentCreate;
        data.comment._id = comment._id,
        expect(statusCode).toBe(200);
        expect(comment.receiver._id).toBe(data.secondUser._id.toString());
        expect(comment.owner._id).toBe(data.user._id.toString());
    });

    it("Get commet by id", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(COMMENT_QUERY(data.comment._id));
        expect(statusCode).toBe(200);
        expect(body.data.comment._id).toBe(data.comment._id.toString());
    });

    it("Get comments by ids", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(COMMENTS_BY_IDS_QUERY([data.comment._id]));
        expect(statusCode).toBe(200);
        expect(body.data.commentsByIds.length).not.toBe(0);
    });

    it("Get commment replies (must be 0)", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(COMMENT_REPLIES_BY_ID_QUERY(data.comment._id));
        expect(statusCode).toBe(200);
        expect(body.data.commentReplies.length).toBe(0);
    });

    it("Get comments related to post by post id", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(COMMENTS_BY_POST_ID_QUERY(data.post1._id));
        expect(statusCode).toBe(200);
        expect(body.data.commentsByPostId.length).not.toBe(0);
    });

    it ("Delete comment by id", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(COMMENT_DELETE_BY_ID_MUTATION(data.comment._id));
        expect(statusCode).toBe(200);
        expect(body.data.commentDeleteById._id).toBe(data.comment._id.toString());
    });
});

