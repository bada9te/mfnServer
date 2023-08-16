const supportRequestModel = require('../../models/support-requests/support-requests.model');


// create report
const createSupportRequest = async(req, res, next) => {
    const supportRequest = req.body.supportRequest;
    try {
        await supportRequestModel.createSupportRequest(supportRequest);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const closeSupportRequest = async(req, res, next) => {
    const supportRequestId = req.body.supportRequestId;
    try {
        await supportRequestModel.closeSupportRequest(supportRequestId);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    createSupportRequest,
    closeSupportRequest,
}
