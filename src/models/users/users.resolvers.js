const exec = require("../../db-reslovers/execGQL");
const { getAllUsersDB, getUserByEmailDB, getUserByIdDB, getUsersByIdsDB, getUsersByNicknameDB, addUserDB, deleteUserByIdDB, switchSubscriptionOnUserDB, updateUserDB, confirmAccountDB, restoreAccountDB, prepareAccountToRestoreDB } = require("../../db-reslovers/users-db-resolver");

module.exports = {
    Query: {
        getAllUsers: async() => {
            return await exec(getAllUsersDB);
        },
        getUserByEmail: async(_, { email }) => {
            return await exec(() => getUserByEmailDB(email));
        }, 
        getUserById: async(_, { _id }) => {
            return await exec(() => getUserByIdDB(_id));
        },
        getManyUsersByIds: async(_, { ids }) => {
            return await exec(() => getUsersByIdsDB(ids));
        },
        getManyUsersByNickname: async(_, { nick }) => {
            return await exec(() => getUsersByNicknameDB(nick));
        },
    },
    Mutation: {
        addUser: async(_, { input }) => {
            return await exec(() => addUserDB(input));
        },
        deleteUserById: async(_, { _id }) => {
            return await exec(() => deleteUserByIdDB(_id));
        },
        updateUser: async(_, { input }) => {
            const { _id, what, value } = input;
            return await exec(() => updateUserDB(_id, value, what));
        },
        switchSubscriptionOnUser: async(_, { input }) => {
            const { userId, subscriberId } = input;
            return await exec(() => switchSubscriptionOnUserDB(userId, subscriberId));
        },
        confirmAccount: async(_, { input }) => {
            const { userId, actionId, verifyToken } = input;
            return await exec(() => confirmAccountDB(userId, actionId, verifyToken));
        },
        restoreAccount: async(_, { input }) => {
            const { userId, actionId, verifyToken, type } = input;
            return await exec(() => restoreAccountDB(userId, actionId, verifyToken, type));
        },
        prepareAccountToRestore: async(_, { input }) => {
            const { email, type } = input;
            return await exec(() => prepareAccountToRestoreDB(email, type));
        },
    }
}