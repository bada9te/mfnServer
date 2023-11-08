const { getAllBattlesByStatusResolver, addNewBattleResolver, deleteBattleResolver, makeVoteResolver } = require("../../db-reslovers/battles-db-resolver");

module.exports = {
    Query: {
        getAllBattlesByStatus: async(_, { input }) => {
            const { status, skipCount } = input;
            return await getAllBattlesByStatusResolver(skipCount, status);
        }
    },
    Mutation: {
        addNewBattleByPostsIds: async(_, { input }) => {
            const battle = { ...input };
            const dateEnd = new Date();
            dateEnd.setDate(dateEnd.getDate() + 1);
            battle.willFinishAt = dateEnd.toISOString();

            return await addNewBattleResolver(battle);
        },
        deleteBattleById: async(_, { _id }) => {
            return await deleteBattleResolver(_id);
        },
        makeBattleVote: async(_, { input }) => {
            const { battleId, postNScore, voteCount, voterId } = input;
            return await makeVoteResolver(battleId, postNScore, voteCount, voterId);
        },
    }
}