const supportRequestModel = require("./support-requests.model");

module.exports = {
    Query: {
        supportRequests: async() => {
            return await supportRequestModel.getAllSupportRequests()
        },
        supportRequest: async(_, { _id }) => {
            return await supportRequestModel.getSupportRequestById(_id);
        }
    },
    Mutation: {
        supportRequestCreate: async(_, { input }) => {
            let createdSupportReq;
            await supportRequestModel.createSupportRequest(supportRequest)
                .then(data => {
                    createdSupportReq = data[0];
                })
            return createdSupportReq;
        },
        supportRequestClose: async(_, { _id }) => {
            return await supportRequestModel.closeSupportRequest(_id);
        },
    }
}