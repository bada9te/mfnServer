const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../src/app");
const data = require("../testData");
const { REPORT_QUERY, REPORT_CREATE_MUTATION, REPORTS_QUERY, REPORT_CLOSE_MUTATION } = require("./report.gql");


const GQL_PATH = '/graphql';

describe("Reports tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    it("Create report", async() => {
        const report = {
            contactReason: "test",
            email: data.user.email,
            message: "test",
            reportOwner: data.user._id,
            //reportedPost: ID
            //reportedComment: ID
        }
        const { statusCode, body } = await request(app).post(GQL_PATH).send(REPORT_CREATE_MUTATION(report));
        console.log(body)
        data.report._id = body.data.reportCreate._id;
        expect(statusCode).toBe(200);
        expect(body.data.reportCreate.email).toBe(data.user.email);
    });

    // get report by id
    it("Get report by id", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(REPORT_QUERY(data.report._id));
        expect(statusCode).toBe(200);
        expect(body.data.report._id).toBe(data.report._id.toString());
    });

    // get all reports
    it("Get many reports", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(REPORTS_QUERY(0, 12));
        expect(statusCode).toBe(200);
        expect(body.data.reports.length).not.toBe(0);
    });

    // close report
    it("Close report", async() => {
        const { statusCode, body } = await request(app).post(GQL_PATH).send(REPORT_CLOSE_MUTATION(data.report._id));
        expect(statusCode).toBe(200);
        expect(body.data.reportClose.isClosed).toBe(true);
    });
})