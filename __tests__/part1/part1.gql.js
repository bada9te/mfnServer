const data = require("../testData");

// create user
module.exports = {
    USER_CREATE_MUTATION: {
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
            input: data.user,
        }
    },

    // confirm account
    USER_CONFIRM_ACCOUNT_MUTATION: {
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
                userId: data.user._id,
                actionId: data.moderationAction._id,
                verifyToken: data.moderationAction.verifyToken,
            }
        }
    },

    ALL_USERS_QUERY: {
        query: `query users {
            users {
                _id
            }
        }`,
    },

    // get user by id 
    USER_BY_ID_QUERY: {
        query: `query user($_id: ID!) {
            user(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: data.user._id,
        }
    },

    // get user by email 
    USER_BY_EMAIL_QUERY: {
        query: `query userByEmail($email: String!) {
            userByEmail(email: $email) {
                _id
            }
        }`,
        variables: {
            email: data.user.email,
        }
    },

    // get by ids array
    USERS_BY_IDS_QUERY: {
        query: `query usersByIds($ids: [ID!]!) {
            usersByIds(ids: $ids) {
                _id
            }
        }`,
        variables: {
            ids: [data.user._id],
        }
    },

    // get by nickname
    USERS_BY_NICKNAME: {
        query: `query usersByNickname($nick: String!) {
            usersByNickname(nick: $nick) {
                _id
            }
        }`,
        variables: {
            nick: data.user.nick,
        }
    },

    // update user data (nick)
    USER_UPDATE_NICKNAME_MUTATION: {
        query: `mutation userUpdate($input: UpdateUserInput!) {
            userUpdate(input: $input) {
                _id
                nick
            }
        }`,
        variables: {
            input: {
                _id: data.user._id,
                what: 'nick',
                value: 'newNick',
            }
        }
    },

    // delete by id
    USER_DELETE_BY_ID_MUTATION: {
        query: `mutation userDeleteById($_id: ID!) {
            userDeleteById(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: data.user._id,
        }
    }
}
