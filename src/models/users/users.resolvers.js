const exec = require("../../db-reslovers/execGQL");
const { getAllUsersDB, getUserByEmailDB, getUserByIdDB, getUsersByIdsDB, getUsersByNicknameDB, addUserDB, deleteUserByIdDB, switchSubscriptionOnUserDB, updateUserDB, confirmAccountDB, restoreAccountDB, prepareAccountToRestoreDB } = require("../../db-reslovers/users-db-resolver");

module.exports = {
    Query: {
        users: async() => {
            return await exec(getAllUsersDB);
        },
        userByEmail: async(_, { email }) => {
            return await exec(() => getUserByEmailDB(email));
        }, 
        user: async(_, { _id }) => {
            return await exec(() => getUserByIdDB(_id));
        },
        usersByIds: async(_, { ids }) => {
            return await exec(() => getUsersByIdsDB(ids));
        },
        usersByNickname: async(_, { nick }) => {
            return await exec(() => getUsersByNicknameDB(nick));
        },
    },
    Mutation: {
        userCreate: async(_, { input }) => {
            return await exec(() => addUserDB(input));
        },
        userDeleteById: async(_, { _id }) => {
            return await exec(() => deleteUserByIdDB(_id));
        },
        userUpdate: async(_, { input }) => {
            const { _id, what, value } = input;
            return await exec(() => updateUserDB(_id, value, what));
        },
        userSwitchSubscription: async(_, { input }) => {
            const { userId, subscriberId } = input;
            return await exec(() => switchSubscriptionOnUserDB(userId, subscriberId));
        },
        userConfirmAccount: async(_, { input }) => {
            const { userId, actionId, verifyToken } = input;
            return await exec(() => confirmAccountDB(userId, actionId, verifyToken));
        },
        userRestoreAccount: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await exec(() => restoreAccountDB(userId, actionId, verifyToken, type));
        },
        userPrepareAccountToRestore: async(_, { input }) => {
            const { email, type } = input;
            return await exec(() => prepareAccountToRestoreDB(email, type));
        },
    }
}