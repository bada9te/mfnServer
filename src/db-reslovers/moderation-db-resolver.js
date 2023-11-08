const usersModel = require('../models/users/users.model');
const moderationModel = require('../models/moderation/moderation.model');


const createModerationActionResolver = async(action) => {
    const user = await usersModel.getUserById(action.user);
    if (!user?._id) {
        return "Error";
    }

    let createdAction;
    await moderationModel.createAction(action).then((actionData) => {
        createdAction = actionData;
        if (action.type === "emailChange") {
            //sendMail.sendChangeEmail(user.email, user.nick, newValue, );
        }
    });
    return createdAction;
}

const deleteModerateActionResolver = async(userId, actionId, verifyToken, type) => {
    return await moderationModel.deleteAction(userId, actionId, verifyToken, type);
}

const validateModerateActionResolver = async(userId, actionId, verifyToken, type) => {
    return await moderationModel.validateAction(userId, actionId, verifyToken, type);
}


module.exports = {
    createModerationActionResolver,
    deleteModerateActionResolver,
    validateModerateActionResolver,
}