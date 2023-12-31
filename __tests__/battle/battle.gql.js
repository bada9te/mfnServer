module.exports = {
    BATTLES_BY_STATUS_QUERY: (status, offset, limit) => ({
        query: `query battlesByStatus($status: String!, $offset: Int!, $limit: Int!) {
            battlesByStatus(status: $status, offset: $offset, limit: $limit) {
                _id
            }
        }`,
        variables: {
            status, offset, limit
        }
    }),

    BATTLE_CREATE_MUTATION: (input) => ({
        query: `mutation battleCreate($input: AddNewBattleByPostsIdsInput!) {
            battleCreate(input: $input) {
                _id
                post1 {
                    _id
                }
                post2 {
                    _id
                }
            }
        }`,
        variables: {
            input
        }
    }),
    BATTLE_DELETE_BY_ID_MUTATION: (id) => ({
        query: `mutation battleDeleteById($_id: ID!) {
            battleDeleteById(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id
        }
    }),
    BATTLE_MAKE_VOTE_MUTATION: (input) => ({
        query: `mutation battleMakeVote($input: MakeBattleVoteInput!) {
            battleMakeVote(input: $input) {
                _id
                post1Score
                post2Score
            }
        }`,
        variables: {
            input
        }
    }),
}