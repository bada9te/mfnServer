const exec = require("../../db-reslovers/execGQL");
const { createReportDB, closeReportDB, getAllReportsDB, getReportByIdDB } = require("../../db-reslovers/reports-db-resolver");

module.exports = {
    Query: {
        reports: async() => {
            return await exec(getAllReportsDB);
        },
        report: async(_, { _id }) => {
            return await exec(() => getReportByIdDB(_id));
        }
    },
    Mutation: {
        reportCreate: async(_, { input }) => {
            return await exec(() => createReportDB(input));
        },
        reportClose: async(_, { _id }) => {
            return await exec(() => closeReportDB(_id));
        }
    }
}