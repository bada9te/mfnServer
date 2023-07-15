const moderationModel = require('../../models/moderation/moderation.model');
const usersModel = require('../../models/users/users.model');
const sendMail = require('../../utils/mailer/nodemailer');

const generateRandomString = async() => Math.floor(Math.random() * Date.now()).toString(36);


// create
const createAction = async(req, res) => {
    const action = req.body.action;
    const newValue = req.body.newValue;
    action.verifyToken = await generateRandomString();
    action.createdAt = new Date().toISOString();

    try {
        await usersModel.getUserById(action.user).then(async(user) => {
            await moderationModel.createAction(action).then((data) => {
                if (action.type === "emailChange") {
                    //sendMail.sendChangeEmail(user.email, user.nick, newValue, );
                }
            });
        });
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
        });
    }
}

// delete
const deleteAction = async(req, res) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;
    const type = req.body.type;

    try {
        const action = await moderationModel.deleteAction(userId, actionId, verifyToken, type);
        return res.status(200).json({
            done: true,
            action: action,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
        });
    }
}

// check
const validateAction = async(req, res) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;
    const type = req.body.type;

    try {
        const action = await moderationModel.validateAction(userId, actionId, verifyToken, type);
        return res.status(200).json({
            done: true,
            action: action,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
        });
    }
}



module.exports = {
    createAction,
    deleteAction,
    validateAction,
}