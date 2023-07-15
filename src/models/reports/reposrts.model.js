const Report = require('./reports.mongo');


// create report
const createReport = async(post) => {
    await Report.insertMany([post])
    .catch((err) => {
        throw new Error(err);
    });
}

// close report
const closeReport = async(id) => {
    await Report.findOneAndUpdate({
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
    closeReport,
}