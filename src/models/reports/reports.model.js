const Report = require('./reports.mongo');


// create report
const createReport = async(report) => {
    return await Report.insertMany([report])
}

const getAllReports = async(range) => {
    return await Report.find({})
    .skip(range.offset)
    .limit(range.limit)
}

// close report
const closeReport = async(id) => {
    return await Report.findOneAndUpdate({
        _id: id,
    }, {
        isClosed: true,
    }, {
        upsert: true,
        new: true,
    })
}


// close report
const getReportById = async(id) => {
    return await Report.findOne({
        _id: id,
    })
}


module.exports = {
    createReport,
    getAllReports,
    closeReport,
    getReportById,
}