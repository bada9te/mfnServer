const { getAllBattlesByStatusDB, addNewBattleDB, deleteBattleDB, makeBattleVoteDB } = require("../../db-reslovers/battles-db-resolver");
const exec = require("../../db-reslovers/execGQL");

module.exports = {
    Query: {
        battlesByStatus: async(_, { status, range }) => {
            return await exec(() => getAllBattlesByStatusDB(range, status));
        }
    },
    Mutation: {
        battleCreate: async(_, { input }) => {
            const battle = { ...input };
            const dateEnd = new Date();
            dateEnd.setDate(dateEnd.getDate() + 1);
            battle.willFinishAt = dateEnd.toISOString();
    
            return await exec(() => addNewBattleDB(battle))
        },
        battleDeleteById: async(_, { _id }) => {
            return await exec(() => deleteBattleDB(_id));
        },
        battleMakeVote: async(_, { input }) => {
            const { battleId, postNScore, voteCount, voterId } = input;
            return await exec(() => makeBattleVoteDB(battleId, postNScore, voteCount, voterId));
        },
    }
}