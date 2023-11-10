const { getAllBattlesByStatusDB, addNewBattleDB, deleteBattleDB, makeBattleVoteDB } = require("../../db-reslovers/battles-db-resolver");
const exec = require("../../db-reslovers/execGQL");

module.exports = {
    Query: {
        getAllBattlesByStatus: async(_, { input }) => {
            const { skipCount, status } = input;
            return await exec(() => getAllBattlesByStatusDB(skipCount, status));
        }
    },
    Mutation: {
        addNewBattleByPostsIds: async(_, { input }) => {
            const battle = { ...input };
            const dateEnd = new Date();
            dateEnd.setDate(dateEnd.getDate() + 1);
            battle.willFinishAt = dateEnd.toISOString();
    
            return await exec(() => addNewBattleDB(battle))
        },
        deleteBattleById: async(_, { _id }) => {
            return await exec(() => deleteBattleDB(_id));
        },
        makeBattleVote: async(_, { input }) => {
            const { battleId, postNScore, voteCount, voterId } = input;
            return await exec(() => makeBattleVoteDB(battleId, postNScore, voteCount, voterId));
        },
    }
}