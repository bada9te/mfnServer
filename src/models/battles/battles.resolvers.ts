import battlesModel from "./battles.model";
import { createTask } from "../../utils/cron/cron";
import config from "../../config";

export default {
    Query: {
        battlesByStatus: async(_, { finished, offset, limit }) => {
            return {
                battles: await battlesModel.getAllBattlesByStatus(finished, { offset, limit }),
                count: await battlesModel.getDocsCount({ finished }),
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

            await battlesModel.addBattleByIds(battle)
                .then(async(insertedBattle) => {
                    createdBattle = insertedBattle[0];
                    if (config.base.envType !== "test") {
                        createTask(createdBattle._id, new Date(createdBattle.willFinishAt), async() => {
                            console.log(createdBattle._id, "setting battle as finished...")
                            await battlesModel.setWinnerByBattleId(createdBattle._id);
                        }, 'finishBattle');
                    }
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