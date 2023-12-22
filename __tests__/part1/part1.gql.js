const data = require("../testData");

// create user
module.exports =  {
    USER_CREATE_MUTATION: (user) => ({
        query: `mutation userCreate($input: AddUserInput!) {
            userCreate(input: $input) {
                user {
                    _id
                }
                action {
                    _id            
                    verifyToken
                    type
                    user {
                        _id
                    }
                }
            }
        }`,
        variables: {
            input: user,
        }
    }),

    // confirm account
    USER_CONFIRM_ACCOUNT_MUTATION: (userId, actionId, verifyToken) => ({
        query: `mutation userConfirmAccount($input: AccountConfirmInput!) {
            userConfirmAccount(input: $input) {
                user {
                    _id
                }
                action {
                    _id
                }
            }
        }`,
        variables: {
            input: {
                userId,
                actionId,
                verifyToken,
            }
        }
    }),

    ALL_USERS_QUERY: {
        query: `query users {
            users {
                _id
            }
        }`,
    },

    // get user by id 
    USER_BY_ID_QUERY: (id) => ({
        query: `query user($_id: ID!) {
            user(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),

    // get user by email 
    USER_BY_EMAIL_QUERY: (email) => ({
        query: `query userByEmail($email: String!) {
            userByEmail(email: $email) {
                _id
            }
        }`,
        variables: {
            email,
        }
    }),

    // get by ids array
    USERS_BY_IDS_QUERY: (ids) => ({
        query: `query usersByIds($ids: [ID!]!) {
            usersByIds(ids: $ids) {
                _id
            }
        }`,
        variables: {
            ids,
        }
    }),

    // get by nickname
    USERS_BY_NICKNAME: (nick) => ({
        query: `query usersByNickname($nick: String!) {
            usersByNickname(nick: $nick) {
                _id
            }
        }`,
        variables: {
            nick,
        }
    }),

    // update user data (nick)
    USER_UPDATE_NICKNAME_MUTATION: (input) => ({
        query: `mutation userUpdate($input: UpdateUserInput!) {
            userUpdate(input: $input) {
                _id
                nick
            }
        }`,
        variables: {
            input,
        }
    }),

    // delete by id
    USER_DELETE_BY_ID_MUTATION: (id) => ({
        query: `mutation userDeleteById($_id: ID!) {
            userDeleteById(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),

    // prepare account to restore
    USER_PREPARE_ACCOUNT_TO_RESTORE_MUTATION: (email, type) => ({
        query: `mutation userPrepareAccountToRestore($input: PrepareAccountToRestoreInput!) {
            userPrepareAccountToRestore(input: $input) {
                user {
                    _id
                }
                action {
                    _id            
                    verifyToken
                    type
                    user {
                        _id
                    }
                }
            }
        }`,
        variables: {
            input: {
                email,
                type,
            }
        }
    })
}
