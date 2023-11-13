const exec = require("../../db-reslovers/execGQL");
const { getAllSupportRequestsDB, createSupportRequestDB, closeSupportRequestDB } = require("../../db-reslovers/support-requests-resolver");
const { getSupportRequestById } = require("./support-requests.model");

module.exports = {
    Query: {
        supportRequests: async() => {
            return await exec(getAllSupportRequestsDB);
        },
        supportRequest: async(_, { _id }) => {
            return await exec(() => getSupportRequestById(_id));
        }
    },
    Mutation: {
        supportRequestCreate: async(_, { input }) => {
            return await exec(() => createSupportRequestDB(input))
        },
        supportRequestClose: async(_, { _id }) => {
            return await exec(() => closeSupportRequestDB(_id));
        },
    }
}