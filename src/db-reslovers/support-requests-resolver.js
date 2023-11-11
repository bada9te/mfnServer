const supportRequestModel = require('../models/support-requests/support-requests.model');

const createSupportRequestDB = async(supportRequest) => {
    let createdSupportReq;
    await supportRequestModel.createSupportRequest(supportRequest)
        .then(data => {
            createdSupportReq = data[0];
        })
    return createdSupportReq;
}

const closeSupportRequestDB = async(id) => {
    return await supportRequestModel.closeSupportRequest(id);
} 

const getAllSupportRequestsDB = async() => {
    return await supportRequestModel.getAllSupportRequests();
}

module.exports = {
    createSupportRequestDB,
    closeSupportRequestDB,
    getAllSupportRequestsDB,
}