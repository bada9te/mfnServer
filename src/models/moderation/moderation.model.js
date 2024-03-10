const Moderation = require('./moderation.mongo');


// create 
const createAction = async(action) => {
    return await Moderation.insertMany([action])
}

// delete
const deleteAction = async(userId, actionId, verifyToken, actionType) => {
    return await Moderation.findOneAndRemove({ 
        _id: actionId,
        user: userId,
        verifyToken,
        type: actionType,
    })
}

// check
const validateAction = async(userId, actionId, verifyToken, actionType) => {
    return await Moderation.findOne({
        _id: actionId,
        user: userId,
        type: actionType,
        verifyToken,
    })
}


module.exports = {
    createAction,
    deleteAction,
    validateAction,
}