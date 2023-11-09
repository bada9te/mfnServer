const { GraphQLError } = require("graphql");
const { getAllBattlesByStatusDB, addNewBattleDB, deleteBattleDB, makeBattleVoteDB } = require("../../db-reslovers/battles-db-resolver");

module.exports = {
    Query: {
        getAllBattlesByStatus: async(_, { input }) => {
            try {
                const { status, skipCount } = input;
                return await getAllBattlesByStatusDB(skipCount, status);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        }
    },
    Mutation: {
        addNewBattleByPostsIds: async(_, { input }) => {
            try {
                const battle = { ...input };
                const dateEnd = new Date();
                dateEnd.setDate(dateEnd.getDate() + 1);
                battle.willFinishAt = dateEnd.toISOString();
    
                return await addNewBattleDB(battle);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        deleteBattleById: async(_, { _id }) => {
            try {
                return await deleteBattleDB(_id);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        makeBattleVote: async(_, { input }) => {
            try {
                const { battleId, postNScore, voteCount, voterId } = input;
                return await makeBattleVoteDB(battleId, postNScore, voteCount, voterId);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
    }
}