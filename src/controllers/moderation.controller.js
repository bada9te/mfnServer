const { createModerationActionDB, deleteModerateActionDB, validateModerateActionDB } = require('../db-reslovers/moderation-db-DB');
const sendMail = require('../utils/mailer/nodemailer');

const generateRandomString = async() => Math.floor(Math.random() * Date.now()).toString(36);


// create
const createAction = async(req, res, next) => {
    const action = req.body.action;
    //const newValue = req.body.newValue;
    action.verifyToken = await generateRandomString();

    try {
        await createModerationActionDB(action);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// delete
const deleteAction = async(req, res, next) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;
    const type = req.body.type;

    try {
        const action = await deleteModerateActionDB(userId, actionId, verifyToken, type);
        return res.status(200).json({
            done: true,
            action,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// check
const validateAction = async(req, res, next) => {
    const userId = req.body.userId;
    const actionId = req.body.actionId;
    const verifyToken = req.body.verifyToken;
    const type = req.body.type;

    try {
        const action = await validateModerateActionDB(userId, actionId, verifyToken, type);
        return res.status(200).json({
            done: true,
            action,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    createAction,
    deleteAction,
    validateAction,
}