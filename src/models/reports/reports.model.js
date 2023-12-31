const Report = require('./reports.mongo');


// create report
const createReport = async(report) => {
    return await Report.insertMany([report])
    .catch((err) => {
        throw new Error(err);
    });
}

const getAllReports = async(range) => {
    return await Report.find({})
    .skip(range.offset)
    .limit(range.limit)
    .catch((err) => {
        throw new Error(err);
    });
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
    .catch((err) => {
        throw new Error(err);
    });
}


// close report
const getReportById = async(id) => {
    return await Report.findOne({
        _id: id,
    })
    .catch((err) => {
        throw new Error(err);
    });
}


module.exports = {
    createReport,
    getAllReports,
    closeReport,
    getReportById,
}