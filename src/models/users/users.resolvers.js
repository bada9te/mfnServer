const usersModel = require('../../models/users/users.model');
const moderationModel = require('../../models/moderation/moderation.model');
const sendMail = require('../../utils/mailer/nodemailer');
const bcrypt = require('bcrypt-nodejs');


module.exports = {
    Query: {
        users: async() => {
            return await usersModel.getAllUsers();;
        },
        userByEmail: async(_, { email }) => {
            return await usersModel.getUserByEmail(email);
        }, 
        user: async(_, { _id }) => {
            return await usersModel.getUserById(_id);
        },
        usersByIds: async(_, { ids }) => {
            return await usersModel.getUsersByIds(ids);
        },
        usersByNickname: async(_, { nick }) => {
            return await usersModel.getByNickname(nick);
        },
    },
    Mutation: {
        userDeleteById: async(_, { _id }) => {
            return await usersModel.deleteUserById(_id);
        },
        userUpdate: async(_, { input }, context) => {
            const { _id, what, value } = input;
            console.log(context)
            const user = await usersModel.updateUser(_id, value, what);
            return user;
        },
        userSwitchSubscription: async(_, { input }) => {
            const { userId, subscriberId } = input;
            return {
                user1: await usersModel.switchSubscriptionOnUser(subscriberId, userId),
                user2: await usersModel.switchSubscribedOnUser(subscriberId, userId)
            };
        },
        userConfirmAccount: async(_, { input }) => {
            const { userId, actionId, verifyToken } = input;
            const action = await moderationModel.validateAction(userId, actionId, verifyToken, 'verify');
            const user = await usersModel.confirmAccount(userId);
            if (action && user) {
                await moderationModel.deleteAction(userId, actionId, verifyToken, 'verify');
            }
            return { action, user };
        },
        userRestoreAccount: async(_, { input }) => {
            const { userId, actionId, verifyToken, type, newValue } = input;
            const action = await moderationModel.validateAction(userId, actionId, verifyToken, type);
            let affectedUser;
            if (action) {
                // TODO: FIX req.body.newValue
                if (type === "password") {
                    newValue = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
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
        },
        userPrepareAccountToRestore: async(_, { input }) => {
            const { email, type } = input;
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
                        `${process.env.CLIENT_BASE}/account-restore/${user._id}/${action[0]._id}/${verifyToken}/${type}`,
                    );
                });
            }

            return { action: createdAction, user };
        },
    }
}