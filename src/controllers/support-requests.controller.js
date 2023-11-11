const { createSupportRequestDB, closeSupportRequestDB, getAllSupportRequestsDB } = require('../db-reslovers/support-requests-resolver');


// create report
const createSupportRequest = async(req, res, next) => {
    const supportRequest = req.body.supportRequest;
    try {
        const createdRequest = await createSupportRequestDB(supportRequest);
        return res.status(201).json({
            done: true,
            supportRequest: createdRequest,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const closeSupportRequest = async(req, res, next) => {
    const supportRequestId = req.body.supportRequestId;
    try {
        const supportRequest = await closeSupportRequestDB(supportRequestId);
        return res.status(201).json({
            done: true,
            supportRequest,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const getAllSupportRequests = async(req, res, next) => {
    try {
        const supportRequests = await getAllSupportRequestsDB();
        return res.status(201).json({
            done: true,
            supportRequests,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    createSupportRequest,
    closeSupportRequest,
    getAllSupportRequests,
}
