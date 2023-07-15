const reportsModel = require('../../models/reports/reposrts.model');


// create report
const createReport = async(req, res) => {
    const report = req.body.report;
    try {
        await reportsModel.createReport(report);
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


const closeReport = async(req, res) => {
    const reportId = req.body.reportId;
    try {
        await reportsModel.createReport(reportId);
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
    createReport,
    closeReport,
}
