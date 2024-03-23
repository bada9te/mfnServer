import Moderation from './moderation.mongo';
import { TNewAction } from './types';


// create 
const createAction = async(action: TNewAction) => {
    return await Moderation.insertMany([action])
}

// delete
const deleteAction = async(userId: string, actionId: string, verifyToken: string, actionType: string) => {
    return await Moderation.findOneAndRemove({ 
        _id: actionId,
        user: userId,
        verifyToken,
        type: actionType,
    })
}

// check
const validateAction = async(userId: string, actionId: string, verifyToken: string, actionType: string) => {
    return await Moderation.findOne({
        _id: actionId,
        user: userId,
        type: actionType,
        verifyToken,
    })
}


export {
    createAction,
    deleteAction,
    validateAction,
}