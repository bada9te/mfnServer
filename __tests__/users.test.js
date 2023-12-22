const request = require("supertest");
const app = require("../src/app");

//jest.useFakeTimers();


// get all users query
const GET_ALL_USERS_QUERY = {
    query: `query users() {
        users()
    }`,
}



describe("GraphQL E2E Users", () => {
    it("Get all users", async() => {
        const res = await request(app)
            .post('/graphql')
            .send(GET_ALL_USERS_QUERY);
        expect(res.errors).toBeUndefined(); 
    });
});
