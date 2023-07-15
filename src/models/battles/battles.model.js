const Battles = require('./battles.mongo');
const postsModel = require('../posts/posts.model');


// add battle
const addBattleByIds = async(id1, id2, title, createdAt, willFinishAt) => {
    const posts = await postsModel.getManyByIds([id1, id2]);

    //console.log(posts);
    const newBattle = {
        post1: posts[0]._id,
        post2: posts[1]._id,
        createdAt: createdAt,
        willFinishAt: willFinishAt,
        title: title,
    }

    return await Battles.insertMany([newBattle])
    .catch((err) => {
        throw new Error(err);
    });
}

// remove battle 
const deleteBattle = async(id) => {
    await Battles.deleteOne({
        _id: id,
    })
    .catch((err) => {
        throw new Error(err);
    });
}


// set winner
const setWinnerByBattleId = async(battleId) => {
    await Battles.updateOne({ _id: battleId }, [
        {
            $set: {
                winner: {
                    $switch: {
                        branches: [
                            {
                                case: { $gt: ["$post1Score", "$post2Score"] },
                                then: "$post1",
                            },
                            {
                                case: { $gt: ["$post2Score", "$post1Score"] },
                                then: "$post2",
                            },
                            {
                                case: { $eq: ["$post1Score", "$post2Score"] },
                                then: null,
                            },
                        ]
                    }
                },
                finished: true,
            }
        }
    ])
    .catch((err) => {
        throw new Error(err);
    });
}

// get all battles
const getAllBattlesByStatus = async(status, skipCount) => {
    return await Battles.find({ finished: status }, { '__v': 0 })
    .skip(skipCount)
    .limit(12)
    .catch((err) => {
        throw new Error(err);
    });
}

const updateScore = async(battleId, scoreType, value, voterId) => {
    return await Battles.updateOne(
        { _id: battleId }, 
        { 
            $inc: { [scoreType]: value },
            $push: { votedBy: voterId },
        }
    )
    .catch((err) => {
        throw new Error(err);
    })
}



module.exports = {
    addBattleByIds,
    deleteBattle,
    setWinnerByBattleId,
    getAllBattlesByStatus,
    updateScore,
}