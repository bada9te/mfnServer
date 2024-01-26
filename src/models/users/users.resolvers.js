const usersModel = require('../../models/users/users.model');
const moderationModel = require('../../models/moderation/moderation.model');
const sendMail = require('../../utils/mailer/nodemailer');
const bcrypt = require('bcrypt-nodejs');
const generateRandomString = require('../../utils/functions/generateRandomString');


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
        userCreate: async(_, { input }) => {
            const { _id, email, nick, password } = input;
            const user = {
                _id, 
                local: {
                    email, password,
                },
                nick,
            }
            let createdUser;
            await usersModel.addUser(user)
                .then(data => {
                    createdUser = data[0];
                });


            const action = {
                user: createdUser._id,
                type: "verify",
                verifyToken: generateRandomString(),
            }
            let createdAction;
            await moderationModel.createAction(action)
                .then(data => {
                    createdAction = data[0];
                });
            
            return { action: createdAction, user: createdUser };
        },
        userDeleteById: async(_, { _id }) => {
            return await usersModel.deleteUserById(_id);
        },
        userUpdate: async(_, { input }, context) => {
            const { _id, what, value } = input;
            const user = await usersModel.updateUser(_id, value, what);
            if (context.user) {
                await context.updateSessionUser(user);
            }
            return user;
        },
        userSwitchSubscription: async(_, { input }, context) => {
            const { userId, subscriberId } = input;

            const user1 = await usersModel.switchSubscriptionOnUser(subscriberId, userId)
            const user2 = await usersModel.switchSubscribedOnUser(subscriberId, userId)
            
            if (context.user) {
                await context.updateSessionUser(user2);
            }

            return { user1, user2 };
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
            let { userId, actionId, verifyToken, type, newValue } = input;
            const action = await moderationModel.validateAction(userId, actionId, verifyToken, type);
            let affectedUser;
            if (action) {
                if (type === "password") {
                    type = "local.password";
                    newValue = bcrypt.hashSync(newValue, bcrypt.genSaltSync(8), null);
                } else if (type === "email") {
                    type = "local.email";
                    // try to find a user with the same email
                    const user = await usersModel.getUserByEmail(newValue);
                    if (user) {
                        throw new Error("This email was already taken");
                    }
                }
                
                await usersModel.restoreAccount(userId, newValue, type).then(async(user) => {
                    affectedUser = user;
                    // delete action
                    await moderationModel.deleteAction(userId, actionId, verifyToken, type);
                    // send confirmination mail
                    sendMail.sendInfoEmail(
                        user.local.email,
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
                const verifyToken = generateRandomString();
                await moderationModel.createAction({
                    user: user._id,
                    type: type,
                    createdAt: new Date().toISOString(),
                    verifyToken: verifyToken,
                }).then((action) => {
                    createdAction = action[0];
                    console.log(user)
                    sendMail.sendRestoreEmail(
                        user.local.email,
                        user.nick,
                        `${process.env.CLIENT_BASE}/app/account-restore/${user._id}/${action[0]._id}/${verifyToken}/${type}`,
                    );
                });
            }

            return { action: createdAction, user };
        },
    }
}