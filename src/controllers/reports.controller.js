const reportsModel = require('../models/reports/reports.model');


// create report
const createReport = async(req, res, next) => {
    const report = req.body.report;
    try {
        await reportsModel.createReport(report);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const closeReport = async(req, res, next) => {
    const reportId = req.body.reportId;
    try {
        await reportsModel.createReport(reportId);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    createReport,
    closeReport,
}
