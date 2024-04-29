import * as supportRequestModel from "./support-requests.model";

export default {
    Query: {
        supportRequests: async(_, { offset, limit }) => {
            return await supportRequestModel.getAllSupportRequests({offset, limit})
        },
        supportRequest: async(_, { _id }) => {
            return await supportRequestModel.getSupportRequestById(_id);
        }
    },
    Mutation: {
        supportRequestCreate: async(_, { input }) => {
            let createdSupportReq;
            await supportRequestModel.createSupportRequest(input)
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