module.exports = {
    COMMENT_QUERY: (id) => ({
        query: `query comment($_id: ID!) {
            comment(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),
    COMMENTS_BY_IDS_QUERY: (ids) => ({
        query: `query commentsByIds($ids: [ID!]!) {
            commentsByIds(ids: $ids) {
                _id
            } 
        }`,
        variables: {
            ids,
        }
    }),
    COMMENT_REPLIES_BY_ID_QUERY: (id) => ({
        query: `query commentReplies($_id: ID!) {
            commentReplies(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),
    COMMENTS_BY_POST_ID_QUERY: (id) => ({
        query: `query commentsByPostId($_id: ID!) {
            commentsByPostId(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),

    COMMENT_CREATE_MUTATION: (input) => ({
        query: `mutation commentCreate($input: AddCommentInput!) {
            commentCreate(input: $input) {
                _id
                receiver {
                    _id
                }
                owner {
                    _id
                }
            }
        }`,
        variables: {
            input,
        }
    }),
    COMMENT_DELETE_BY_ID_MUTATION: (id) => ({
        query: `mutation commentDeleteById($_id: ID!) {
            commentDeleteById(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),
}