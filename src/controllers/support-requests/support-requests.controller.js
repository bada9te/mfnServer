const supportRequestModel = require('../../models/support-requests/support-requests.model');


// create report
const createSupportRequest = async(req, res) => {
    const supportRequest = req.body.supportRequest;
    try {
        await supportRequestModel.createSupportRequest(supportRequest);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}


const closeSupportRequest = async(req, res) => {
    const supportRequestId = req.body.supportRequestId;
    try {
        await supportRequestModel.closeSupportRequest(supportRequestId);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}


module.exports = {
    createSupportRequest,
    closeSupportRequest,
}
