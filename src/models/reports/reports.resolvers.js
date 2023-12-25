const reportsModel = require('../../models/reports/reports.model');

module.exports = {
    Query: {
        reports: async(_, { offset, limit }) => {
            return await reportsModel.getAllReports({ offset, limit });
        },
        report: async(_, { _id }) => {
            return await reportsModel.getReportById(_id);
        }
    },
    Mutation: {
        reportCreate: async(_, { input }) => {
            let createdReport;
            await reportsModel.createReport(input).then(data => {
                createdReport = data[0];
            });
            return createdReport;
        },
        reportClose: async(_, { _id }) => {
            return await reportsModel.closeReport(_id);
        }
    }
}