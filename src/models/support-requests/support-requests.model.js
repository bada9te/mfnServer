const SupportRequest = require('./support-requests.mongo');


// create report
const createSupportRequest = async(supReq) => {
    return await SupportRequest.insertMany([supReq])
}

// get all
const getAllSupportRequests = async(range) => {
    return await SupportRequest.find()
    .skip(range.offset)
    .limit(range.limit)
}

// close report
const closeSupportRequest = async(id) => {
    return await SupportRequest.findOneAndUpdate({
        _id: id,
    }, {
        isClosed: true,
    }, {
        upsert: true,
        new: true,
    })
}

// get all
const getSupportRequestById = async(id) => {
    return await SupportRequest.findOne({
        _id: id
    })
}



module.exports = {
    createSupportRequest,
    getAllSupportRequests,
    closeSupportRequest,
    getSupportRequestById,
}