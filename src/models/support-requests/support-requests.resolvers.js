const exec = require("../../db-reslovers/execGQL");
const { getAllSupportRequestsDB, createSupportRequestDB, closeSupportRequestDB } = require("../../db-reslovers/support-requests-resolver");

module.exports = {
    Query: {
        supportRequests: async() => {
            return await exec(getAllSupportRequestsDB);
        },
    },
    Mutation: {
        createSupportRequest: async(_, { input }) => {
            return await exec(() => createSupportRequestDB(input))
        },
        closeSupportRequest: async(_, { _id }) => {
            return await exec(() => closeSupportRequestDB(_id));
        },
    }
}