import { TRange } from '../types';
import Report from './reports.mongo';
import { TNewReport } from './types';


// create report
const createReport = async(report: TNewReport) => {
    return await Report.insertMany([report])
}

const getAllReports = async(range: TRange) => {
    return await Report.find({})
    .skip(range.offset)
    .limit(range.limit)
}

// close report
const closeReport = async(id: string) => {
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
const getReportById = async(id: string) => {
    return await Report.findOne({
        _id: id,
    })
}


export {
    createReport,
    getAllReports,
    closeReport,
    getReportById,
}