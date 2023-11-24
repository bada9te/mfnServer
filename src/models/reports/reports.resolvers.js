const reportsModel = require('../../models/reports/reports.model');

module.exports = {
    Query: {
        reports: async() => {
            return await reportsModel.getAllReports();
        },
        report: async(_, { _id }) => {
            return await reportsModel.getReportById(_id);
        }
    },
    Mutation: {
        reportCreate: async(_, { input }) => {
            let createdReport;
            await reportsModel.createReport(input).then(data => {
                createReportDB = data[0];
            });
            return createdReport;
        },
        reportClose: async(_, { _id }) => {
            return await reportsModel.closeReport(_id);
        }
    }
}