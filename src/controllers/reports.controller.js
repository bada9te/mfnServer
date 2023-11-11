const { createReportDB, closeReportDB, getAllReportsDB } = require('../db-reslovers/reports-db-resolver');


// create report
const createReport = async(req, res, next) => {
    const report = req.body.report;
    try {
        const createdReport = await createReportDB(report);
        return res.status(201).json({
            done: true,
            report: createdReport,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


const closeReport = async(req, res, next) => {
    const reportId = req.body.reportId;
    try {
        const report = await closeReportDB(reportId);
        return res.status(201).json({
            done: true,
            report,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

const getAllReports = async(req, res, next) => {
    try {
        const reports = await getAllReportsDB();
        return res.status(200).json({
            done: true,
            reports,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    createReport,
    closeReport,
    getAllReports,
}
