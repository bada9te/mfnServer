const reportsModel = require('../models/reports/reports.model');

const createReportDB = async(report) => {
    let createdReport;
    await reportsModel.createReport(report).then(data => {
        createReportDB = data[0];
    });
    return createdReport;
}

const closeReportDB = async(id) => {
    return await reportsModel.closeReport(id);
}

const getAllReportsDB = async() => {
    return await reportsModel.getAllReports();
}

const getReportByIdDB = async(id) => {
    return await reportsModel.getReportById(id);
}

module.exports = {
    createReportDB,
    closeReportDB,
    getAllReportsDB,
    getReportByIdDB,
}