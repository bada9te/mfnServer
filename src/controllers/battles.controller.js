const { addNewBattleDB, deleteBattleDB, getAllBattlesByStatusDB, makeBattleVoteDB } = require('../db-reslovers/battles-db-resolver');
const battlesModel = require('../models/battles/battles.model');
const { createTask } = require('../utils/cron/cron');


// add new battles
const addNewBattleByIds = async(req, res, next) => {
    const battle = req.body;
    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 1);
    battle.willFinishAt = dateEnd.toISOString();

    try {
        await addNewBattleDB(battle);
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
        await deleteBattleDB(id);
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

    try {
        const battles = await getAllBattlesByStatusDB(skipCount, status);
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
        await makeBattleVoteDB(battleId, postNScore, voteCount, voterId);
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