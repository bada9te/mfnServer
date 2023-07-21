const SupportRequest = require('./support-requests.mongo');


// create report
const createSupportRequest = async(post) => {
    await SupportRequest.insertMany([post])
    .catch((err) => {
        throw new Error(err);
    });
}

// close report
const closeSupportRequest = async(id) => {
    await SupportRequest.findOneAndUpdate({
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
    closeSupportRequest,
}