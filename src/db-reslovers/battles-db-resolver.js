const battlesModel = require("../models/battles/battles.model");


const addNewBattleResolver = async(battle) => {
    let createdBattle;
    await battlesModel.addBattleByIds(battle.id1, battle.id2, battle.title, battle.createdAt, battle.willFinishAt)
            .then(async(insertedBattle) => {
                createdBattle = insertedBattle;
                createTask(insertedBattle[0]._id, dateEnd, async() => {
                    console.log(insertedBattle[0]._id, "setting battle as finished...")
                    await battlesModel.setWinnerByBattleId(insertedBattle[0]._id);
                }, 'finishBattle');
            });
    return createdBattle;
}

const deleteBattleResolver = async(id) => {
    return await battlesModel.deleteBattle(id);
}

const getAllBattlesByStatusResolver = async(skipCount, status) => {
    if (status === 'running') {
        status = false;
    } else {
        status = true;
    }

    return await battlesModel.getAllBattlesByStatus(status, skipCount);
}

const makeVoteResolver = async(battleId, postNScore, voteCount, voterId) => {
    return await battlesModel.updateScore(battleId, postNScore, voteCount, voterId);
}

module.exports = {
    addNewBattleResolver,
    deleteBattleResolver,
    getAllBattlesByStatusResolver,
    makeVoteResolver,
}