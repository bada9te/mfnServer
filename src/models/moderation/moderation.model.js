const Moderation = require('./moderation.mongo');


// create 
const createAction = async(action) => {
    return await Moderation.insertMany([action])
    .catch(err => {
        throw new Error(err);
    });
}

// delete
const deleteAction = async(userId, actionId, verifyToken, actionType) => {
    return await Moderation.findOneAndRemove({ 
        _id: actionId,
        user: userId,
        verifyToken: verifyToken,
        type: actionType,
    })
    .catch(err => {
        throw new Error(err);
    });
}

// check
const validateAction = async(userId, actionId, verifyToken, actionType) => {
    return await Moderation.findOne({
        _id: actionId,
        user: userId,
        type: actionType,
        verifyToken
    })
    .catch(err => {
        throw new Error(err);
    });
}


module.exports = {
    createAction,
    deleteAction,
    validateAction,
}