const battlesModel = require('../../models/battles/battles.model');
const { createTask } = require('../../utils/cron/cron');


// add new battles
const addNewBattleByIds = async(req, res, next) => {
    const battle = req.body;
    const dateStart = new Date();
    const dateEnd = new Date();
    dateEnd.setDate(dateStart.getDate() + 1);
    battle.createdAt = dateStart.toISOString();
    battle.willFinishAt = dateEnd.toISOString();

    try {
        await battlesModel.addBattleByIds(battle.id1, battle.id2, battle.title, battle.createdAt, battle.willFinishAt)
            .then(async(insertedBattle) => {
                createTask(insertedBattle[0]._id, dateEnd, async() => {
                    console.log(insertedBattle[0]._id, "setting battle as finished...")
                    await battlesModel.setWinnerByBattleId(insertedBattle[0]._id);
                }, 'finishBattle');
                //await battlesModel.setWinnerByBattleId(insertedBattle[0]._id);
            });
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// delete battle
const deleteBattleById = async(req, res, next) => {
    const id = req.body.id;
    try {
        await battlesModel.deleteBattle(id);
        return res.status(200).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}





// get all battles
const getAllBattlesByStatus = async(req, res, next) => {
    const skipCount = req.query.skipCount;
    let status = req.query.status;

    if (status === 'running') {
        status = false;
    } else {
        status = true;
    }

    try {
        const battles = await battlesModel.getAllBattlesByStatus(status, skipCount);
        return res.status(200).json({
            done: true,
            battles: battles,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// make vote
const makeVote = async(req, res, next) => {
    const battleId = req.body.battleId;
    const postNScore = req.body.postNScore;
    const voteCount = req.body.voteCount;
    const voterId = req.body.voterId;

    try {
        await battlesModel.updateScore(battleId, postNScore, voteCount, voterId);
        
        return res.status(200).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    addNewBattleByIds,
    deleteBattleById,
    getAllBattlesByStatus,
    makeVote,
}