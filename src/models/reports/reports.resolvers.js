const exec = require("../../db-reslovers/execGQL");
const { createReportDB, closeReportDB, getAllReportsDB } = require("../../db-reslovers/reports-db-resolver");

module.exports = {
    Query: {
        getAllReports: async() => {
            return await exec(getAllReportsDB);
        }
    },
    Mutation: {
        createReport: async(_, { input }) => {
            return await exec(() => createReportDB(input));
        },
        closeReport: async(_, { _id }) => {
            return await exec(() => closeReportDB(_id));
        }
    }
}