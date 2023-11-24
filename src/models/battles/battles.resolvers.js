const battlesModel = require("../../models/battles/battles.model");
const { createTask } = require("../../utils/cron/cron");

module.exports = {
    Query: {
        battlesByStatus: async(_, { status, offset, limit }) => {
            if (status === 'running') {
                status = false;
            } else {
                status = true;
            }
            return {
                battles: await battlesModel.getAllBattlesByStatus(status, { offset, limit }),
                count: await battlesModel.getDocsCount({ finished: status }),
            }
        }
    },
    Mutation: {
        battleCreate: async(_, { input }) => {
            const battle = { ...input };
            const dateEnd = new Date();
            dateEnd.setDate(dateEnd.getDate() + 1);
            battle.willFinishAt = dateEnd.toISOString();

            let createdBattle;
            await battlesModel.addBattleByIds(battle.post1, battle.post2, battle.title, battle.createdAt, battle.willFinishAt)
                    .then(async(insertedBattle) => {
                        createdBattle = insertedBattle[0];
                        createTask(createdBattle._id, new Date(createdBattle.willFinishAt), async() => {
                            console.log(createdBattle._id, "setting battle as finished...")
                            await battlesModel.setWinnerByBattleId(createdBattle._id);
                        }, 'finishBattle');
                    });
            return createdBattle;
        },
        battleDeleteById: async(_, { _id }) => {
            return await battlesModel.deleteBattle(_id);
        },
        battleMakeVote: async(_, { input }) => {
            const { battleId, postNScore, voteCount, voterId } = input;
            return await battlesModel.updateScore(battleId, postNScore, voteCount, voterId);
        },
    }
}