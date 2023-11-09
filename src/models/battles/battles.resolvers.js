const { getAllBattlesByStatusDB, addNewBattleDB, deleteBattleDB, makeBattleVote } = require("../../db-reslovers/battles-db-DB");

module.exports = {
    Query: {
        getAllBattlesByStatus: async(_, { input }) => {
            const { status, skipCount } = input;
            return await getAllBattlesByStatusDB(skipCount, status);
        }
    },
    Mutation: {
        addNewBattleByPostsIds: async(_, { input }) => {
            const battle = { ...input };
            const dateEnd = new Date();
            dateEnd.setDate(dateEnd.getDate() + 1);
            battle.willFinishAt = dateEnd.toISOString();

            return await addNewBattleDB(battle);
        },
        deleteBattleById: async(_, { _id }) => {
            return await deleteBattleDB(_id);
        },
        makeBattleVote: async(_, { input }) => {
            const { battleId, postNScore, voteCount, voterId } = input;
            return await makeBattleVote(battleId, postNScore, voteCount, voterId);
        },
    }
}