const battlesModel = require("../models/battles/battles.model");


const addNewBattleDB = async(battle) => {
    let createdBattle;
    await battlesModel.addBattleByIds(battle.id1, battle.id2, battle.title, battle.createdAt, battle.willFinishAt)
            .then(async(insertedBattle) => {
                createdBattle = insertedBattle[0];
                createTask(createdBattle._id, dateEnd, async() => {
                    console.log(createdBattle._id, "setting battle as finished...")
                    await battlesModel.setWinnerByBattleId(createdBattle._id);
                }, 'finishBattle');
            });
    return createdBattle;
}

const deleteBattleDB = async(id) => {
    return await battlesModel.deleteBattle(id);
}

const getAllBattlesByStatusDB = async(skipCount, status) => {
    if (status === 'running') {
        status = false;
    } else {
        status = true;
    }

    return await battlesModel.getAllBattlesByStatus(status, skipCount);
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