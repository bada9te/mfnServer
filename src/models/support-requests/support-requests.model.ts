import { TRange } from '../types';
import SupportRequest from './support-requests.mongo';
import { TNewSupportRequest } from './types';


// create report
const createSupportRequest = async(supReq: TNewSupportRequest) => {
    return await SupportRequest.insertMany([supReq])
}

// get all
const getAllSupportRequests = async(range: TRange) => {
    return await SupportRequest.find()
    .skip(range.offset)
    .limit(range.limit)
}

// close report
const closeSupportRequest = async(id: string) => {
    return await SupportRequest.findOneAndUpdate({
        _id: id,
    }, {
        isClosed: true,
    }, {
        upsert: true,
        new: true,
    })
}

// get all
const getSupportRequestById = async(id: string) => {
    return await SupportRequest.findOne({
        _id: id
    })
}



export {
    createSupportRequest,
    getAllSupportRequests,
    closeSupportRequest,
    getSupportRequestById,
}