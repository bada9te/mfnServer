module.exports = {
    MODERATION_ACTION_VALIDATE_QUERY: (input) => ({
        query: `query moderationActionValidate($input: ModerateActionInput!) {
            moderationActionValidate(input: $input) {
                _id
                type
            }
        }`,
        variables: {
            input
        }
    }),

    MODERATION_ACTION_CREATE_MUTATION: (input) => ({
        query: `mutation moderationActionCreate($input: CreateModerationActionInput!) {
            moderationActionCreate(input: $input) {
                _id
                type
                verifyToken
            }
        }`,
        variables: {
            input
        }
    }),
    MODERATION_ACTION_DELETE_MUTATION: (input) => ({
        query: `mutation moderationActionDelete($input: ModerateActionInput!) {
            moderationActionDelete(input: $input) {
                _id
                type
            }
        }`,
        variables: {
            input
        }
    }),
}