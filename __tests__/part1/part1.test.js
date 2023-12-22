const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");
const data = require("../testData");
const {
    USER_CREATE_MUTATION,
    USER_CONFIRM_ACCOUNT_MUTATION,
    ALL_USERS_QUERY,
    USER_BY_ID_QUERY,
    USER_BY_EMAIL_QUERY,
    USERS_BY_IDS_QUERY,
    USERS_BY_NICKNAME,
    USER_UPDATE_NICKNAME_MUTATION,
    USER_DELETE_BY_ID_MUTATION,
} = require('./part1.gql');


const GQL_PATH = '/graphql';


describe("Part 1 (Basic user operations)", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(() => {
        mongoose.connection.close();
    });

    // create user
    it("Create a user", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(USER_CREATE_MUTATION);
        const resData = body.data.userCreate; // { user, action }
        data.moderationAction = resData.action;
        expect(statusCode).toBe(200);
        expect(resData.user._id).toBe(data.user._id.toString());
        expect(resData.action).toBeTruthy();
    });

    // confirm account 
    it("Confirm account", async() => {
        console.log(data.moderationAction)
        const { statusCode, body } = await request(app).post(GQL_PATH).send({
            query: `mutation userConfirmAccount($input: AccountConfirmInput!) {
                userConfirmAccount(input: $input) {
                    user {
                        _id
                    }
                    action {
                        _id
                    }
                }
            }`,
            variables: {
                input: {
                    userId: data.user._id,
                    actionId: data.moderationAction._id,
                    verifyToken: data.moderationAction.verifyToken,
                }
            }
        });
        console.log('AAAAAAAAAAA', body)
        const resData = body.data.userConfirmAccount; // { user, action }
        expect(statusCode).toBe(200);
        expect(resData.user._id).toBe(data.user._id.toString());
        expect(resData.action._id).toBe(data.moderationAction._id.toString());
    }) 
    
    // users
    it("Get all users", async() => {
        const { statusCode } = await request(app).post(GQL_PATH).send(ALL_USERS_QUERY);
        expect(statusCode).toBe(200);   
    });

    // user
    it("Get user by id", async() => {
        const { statusCode } = await request(app).post(GQL_PATH).send(USER_BY_ID_QUERY);
        expect(statusCode).toBe(200);
    });

    // user by email
    it("Get user by email", async() => {
        const { statusCode } = await request(app).post(GQL_PATH).send(USER_BY_EMAIL_QUERY); 
        expect(statusCode).toBe(200);
    });

    // users by ids
    it("Get users by ids, expecting one user by unique id", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(USERS_BY_IDS_QUERY);
        expect(statusCode).toBe(200);
        expect(body.data.usersByIds.length).toBe(1);
    });

    // users by nickname
    it("Get users by nickname, expecting one to be with the nickname given", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(USERS_BY_NICKNAME);
        expect(statusCode).toBe(200);
        expect(body.data.usersByNickname.length).not.toBe(0);
    });

    // update document (nickname)
    it("Update a part of the user", async() => {
        const res = await request(app).post(GQL_PATH).send(USER_UPDATE_NICKNAME_MUTATION);
        let { statusCode, body } = res
        expect(statusCode).toBe(200);
        expect(body.data.userUpdate._id).toBe(data.user._id.toString());
        expect(body.data.userUpdate.nick).toBe("newNick");
    });
    
    // delete user by id
    it("Delete user by id", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(USER_DELETE_BY_ID_MUTATION);
        expect(statusCode).toBe(200);
        expect(body.data.userDeleteById._id).toBe(data.user._id.toString());
    });
});
