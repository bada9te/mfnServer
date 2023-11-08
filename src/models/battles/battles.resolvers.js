const { getAllBattlesByStatusResolver, addNewBattleResolver, deleteBattleResolver, makeVoteResolver } = require("../../db-reslovers/battles-db-resolver");

module.exports = {
    Query: {
        getAllBattlesByStatus: async(_, args) => {
            const { status, skipCount } = args.input;
            return await getAllBattlesByStatusResolver(skipCount, status);
        }
    },
    Mutation: {
        addNewBattleByPostsIds: async(_, args) => {
            const battle = { ...args.input };
            const dateEnd = new Date();
            dateEnd.setDate(dateEnd.getDate() + 1);
            battle.willFinishAt = dateEnd.toISOString();

            return await addNewBattleResolver(battle);
        },
        deleteBattleById: async(_, args) => {
            const _id = args._id;
            return await deleteBattleResolver(_id);
        },
        makeBattleVote: async(_, args) => {
            const { battleId, postNScore, voteCount, voterId } = args.input;
            return await makeVoteResolver(battleId, postNScore, voteCount, voterId);
        },
    }
}