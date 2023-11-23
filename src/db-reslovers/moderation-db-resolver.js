const usersModel = require('../models/users/users.model');
const moderationModel = require('../models/moderation/moderation.model');


const createModerationActionDB = async(action) => {
    const user = await usersModel.getUserById(action.user);
    if (!user?._id) {
        return "Error";
    }

    let createdAction;
    await moderationModel.createAction(action).then(data => {
        createdAction = data[0];
    });
    return createdAction;
}

const deleteModerateActionDB = async(userId, actionId, verifyToken, type) => {
    return await moderationModel.deleteAction(userId, actionId, verifyToken, type);
}

const validateModerateActionDB = async(userId, actionId, verifyToken, type) => {
    return await moderationModel.validateAction(userId, actionId, verifyToken, type);
}


module.exports = {
    createModerationActionDB,
    deleteModerateActionDB,
    validateModerateActionDB,
}