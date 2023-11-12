const usersModel = require('../models/users/users.model');
const moderationModel = require('../models/moderation/moderation.model');
const bcrypt = require('bcrypt');
const sendMail = require('../utils/mailer/nodemailer');


const generateRandomString = async() => Math.floor(Math.random() * Date.now()).toString(36);


const addUserDB = async(user) => {
    const checkUser = await usersModel.getUserByEmail(user.email);
    if (checkUser) {
        throw new Error("User with this email already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    let createdUser;
    await usersModel.addUser(user).then(async(data) => {
        createdUser = data[0];
        const verifyToken = await generateRandomString();
        await moderationModel.createAction({
            user: createdUser._id,
            type: "verify",
            verifyToken: verifyToken,
        }).then((action) => {
            sendMail.sendVerifyEmail(
                createdUser.email, 
                createdUser.nick, 
                `${process.env.CLIENT_BASE.split(', ')[0]}/account-verify/${createdUser._id}/${action[0]._id}`,
                verifyToken
            );
        });
    });

    return createdUser;
}

const deleteUserByIdDB = async(id) => {
    return await usersModel.deleteUserById(id);
}

const updateUserDB = async(id, value, what) => {
    return await usersModel.updateUser(id, value, what);
}

const getUserByEmailDB = async(email) => {
    return await usersModel.getUserByEmail(email);
}

const getUserByIdDB = async(id) => {
    return await usersModel.getUserById(id)
}

const getUsersByIdsDB = async(ids) => {
    return await usersModel.getUsersByIds(ids);
}

const validateUserDB = async(email, password) => {
    const user = await usersModel.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    if (!await bcrypt.compare(password, user.password)) {
        throw new Error("Password is not valid");
    }
    return user;
}

const getAllUsersDB = async() => {
    return await usersModel.getAllUsers();
}

const getUsersByNicknameDB = async(nickname) => {
    return await usersModel.getByNickname(nickname);
}

const switchSubscriptionOnUserDB = async(userId, subscriberId) => {
    return {
        user1: await usersModel.switchSubscriptionOnUser(subscriberId, userId),
        user2: await usersModel.switchSubscribedOnUser(subscriberId, userId)
    }
}

const confirmAccountDB = async(userId, actionId, verifyToken) => {
    const action = await moderationModel.validateAction(userId, actionId, verifyToken, 'verify');
    const user = await usersModel.confirmAccount(userId);
    if (action && user) {
        await moderationModel.deleteAction(userId, actionId, verifyToken, 'verify');
    }

    return { action, user };
}

const restoreAccountDB = async(userId, actionId, verifyToken, type) => {
    const action = await moderationModel.validateAction(userId, actionId, verifyToken, type);
    let affectedUser;
    if (action) {
        let newValue = req.body.newValue;
        if (type === "password") {
            newValue = await bcrypt.hash(newValue, 10);
        }
        await usersModel.restoreAccount(userId, newValue, type).then(async(user) => {
            affectedUser = user;
            await moderationModel.deleteAction(userId, actionId, verifyToken, type);
            sendMail.sendInfoEmail(
                user.email,
                user.nick,
                `Your account ${type} was successfully updated.`  
            );
        });
    }

    return { action, user: affectedUser };
}

const prepareAccountToRestoreDB = async(email, type) => {
    const user = await usersModel.getUserByEmail(email);
    let createdAction;
    if (user) {
        const verifyToken = await generateRandomString();
        await moderationModel.createAction({
            user: user._id,
            type: type,
            createdAt: new Date().toISOString(),
            verifyToken: verifyToken,
        }).then((action) => {
            createdAction = action[0];
            sendMail.sendRestoreEmail(
                user.email,
                user.nick,
                `${process.env.CLIENT_BASE.split(', ')[0]}/account-restore/${user._id}/${action[0]._id}/${verifyToken}/${type}`,
            );
        });
    }

    return { action: createdAction, user };
}

module.exports = {
    addUserDB,
    deleteUserByIdDB,
    updateUserDB,
    getUserByEmailDB,
    getUserByIdDB,
    getUsersByIdsDB,
    validateUserDB,
    getAllUsersDB,
    getUsersByNicknameDB,
    switchSubscriptionOnUserDB,
    confirmAccountDB,
    restoreAccountDB,
    prepareAccountToRestoreDB,
}