const Battles = require('./battles.mongo');
const postsModel = require('../posts/posts.model');


// add battle
const addBattleByIds = async(id1, id2, title, willFinishAt) => {
    //const posts = await postsModel.getManyByIds([id1, id2]);

    //console.log(posts);
    const newBattle = {
        post1: id1,
        post2: id2,
        willFinishAt,
        title,
    }

    return await Battles.insertMany([newBattle])
    .catch((err) => {
        throw new Error(err);
    });
}

// remove battle 
const deleteBattle = async(id) => {
    await Battles.findOneAndDelete({
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
const getAllBattlesByStatus = async(status, range) => {
    return await Battles.find({ finished: status }, { '__v': 0 })
    .skip(range.offset)
    .limit(range.limit)
    .catch((err) => {
        throw new Error(err);
    });
}

const updateScore = async(battleId, scoreType, value, voterId) => {
    return await Battles.findOneAndUpdate(
        { _id: battleId }, 
        { 
            $inc: { [scoreType]: value },
            $push: { votedBy: voterId },
        },
        { new: true }
    )
    .catch((err) => {
        throw new Error(err);
    })
}

// count docs
const getDocsCount = async(filter) => {
    return await Battles.countDocuments(filter).exec()
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
    getDocsCount,
}