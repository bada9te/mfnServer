const SupportRequest = require('./support-requests.mongo');


// create report
const createSupportRequest = async(supReq) => {
    return await SupportRequest.insertMany([supReq])
    .catch((err) => {
        throw new Error(err);
    });
}

// get all
const getAllSupportRequests = async() => {
    return await SupportRequest.find()
    .catch((err) => {
        throw new Error(err);
    });
}

// close report
const closeSupportRequest = async(id) => {
    return await SupportRequest.findOneAndUpdate({
        _id: id,
    }, {
        isClosed: true,
    }, {
        upsert: true,
    })
    .catch((err) => {
        throw new Error(err);
    });
}



module.exports = {
    createSupportRequest,
    getAllSupportRequests,
    closeSupportRequest,
}