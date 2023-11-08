const Report = require('./reports.mongo');


// create report
const createReport = async(report) => {
    return await Report.insertMany([report])
    .catch((err) => {
        throw new Error(err);
    });
}

const getAllReports = async() => {
    return await Report.find({})
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
    })
    .catch((err) => {
        throw new Error(err);
    });
}



module.exports = {
    createReport,
    getAllReports,
    closeReport,
}