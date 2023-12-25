module.exports = {
    POST_BY_ID_QUERY: (id) => ({
        query: `query post($_id: ID!) {
            post(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),
    POSTS_QUERY: (offset, limit) => ({
        query: `query posts($offset: Int!, $limit: Int!) {
            posts(offset: $offset, limit: $limit) {
                posts {
                    _id
                }
                count
            }
        }`,
        variables: {
            offset, limit
        }
    }),
    POSTS_BY_OWNER_QUERY: (owner, offset, limit) => ({
        query: `query postsByOwner($owner: ID!, $offset: Int!, $limit: Int!) {
            postsByOwner(owner: $owner, offset: $offset, limit: $limit) {
                posts {
                    _id
                }
                count
            }
        }`,
        variables: {
            owner, offset, limit
        }
    }),
    POSTS_SAVED_BY_USER_QUERY: (user, offset, limit) => ({
        query: `query postsSavedByUser($user: ID!, $offset: Int!, $limit: Int!) {
            postsSavedByUser(user: $user, offset: offset, limit: $limit) {
                posts {
                    _id
                }
                count
            }
        }`,
        variables: {
            user, offset, limit
        }
    }),
    // title, userId, userIsOwner
    POSTS_BY_TITLE_QUERY: (input) => ({
        query: `query postsByTitle($input: PostsByTitleInput!) {
            postsByTitle(input: $input) {
                _id
            }
        }`,
        variables: {
            input
        }
    }),
    POSTS_BY_IDS_QUERY: (ids) => ({
        query: `query postsByIds($ids: [ID!]!) {
            postsByIds(ids: $ids) {
                _id
            }
        }`,
        variables: {
            ids
        }
    }),

    POST_CREATE_MUTATION: (input) => ({
        query: `mutation postCreate($input: AddPostInput!) {
            postCreate(input: $input) {
                _id
                owner {
                    _id
                }
            }
        }`,
        variables: {
            input
        }
    }),
    POST_UPDATE_MUTATION: (input) => ({
        query: `mutation postUpdate($input: UpdatePostInput!) {
            postUpdate(input: $input) {
                _id
            }
        }`,
        variables: {
            input
        }
    }),
    POST_DELETE_MUTATION: (id) => ({
        query: `mutation postDeleteById($_id: ID!) {
            postDeleteById(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),
    POST_SWICTH_LIKE_MUTATION: (input) => ({
        query: `mutation postSwitchLike($input: SwitchLikeOrPostInSavedInput!) {
            postSwitchLike(input: $input) {
                _id
            }
        }`,
        variables: {
            input
        }
    }),
    POST_SWITCH_IN_SAVED_MUTATION: (input) => ({
        query: `mutation postSwicthInSaved($input: SwitchLikeOrPostInSavedInput!) {
            postSwicthInSaved(input: $input) {
                _id
            }
        }`,
        variables: {
            input
        }
    }),
}