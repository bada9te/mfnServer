const battlesModel = require("../models/battles/battles.model");
const { createTask } = require("../utils/cron/cron");


const addNewBattleDB = async(battle) => {
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
}

const deleteBattleDB = async(id) => {
    return await battlesModel.deleteBattle(id);
}

const getAllBattlesByStatusDB = async(range, status) => {
    if (status === 'running') {
        status = false;
    } else {
        status = true;
    }
    return {
        battles: await battlesModel.getAllBattlesByStatus(status, range),
        count: await battlesModel.getDocsCount({ finished: status }),
    }
}

const makeBattleVoteDB = async(battleId, postNScore, voteCount, voterId) => {
    return await battlesModel.updateScore(battleId, postNScore, voteCount, voterId);
}

module.exports = {
    addNewBattleDB,
    deleteBattleDB,
    getAllBattlesByStatusDB,
    makeBattleVoteDB,
}