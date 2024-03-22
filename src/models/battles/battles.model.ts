import { TRange } from '../types';
import Battles from './battles.mongo';
import { TNewBattle } from './types';

// add battle
const addBattleByIds = async(newBattle: TNewBattle) => {
    return await Battles.insertMany([newBattle]);
}

// remove battle 
const deleteBattle = async(id: string) => {
    return await Battles.findOneAndDelete({
        _id: id,
    });
}


// set winner
const setWinnerByBattleId = async(battleId: string) => {
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
}

// get all battles
const getAllBattlesByStatus = async(finished: boolean, range: TRange) => {
    return await Battles.find({ finished }, { '__v': 0 })
    .skip(range.offset)
    .limit(range.limit)
    .sort({ createdAt: -1 });
}

const updateScore = async(battleId: string, scoreType: string, value: number, voterId: string) => {
    return await Battles.findOneAndUpdate(
        { _id: battleId }, 
        { 
            $inc: { [scoreType]: value },
            $push: { votedBy: voterId },
        },
        { new: true }
    )
}

// count docs
const getDocsCount = async(filter: any) => {
    return await Battles.countDocuments(filter).exec()
}



export {
    addBattleByIds,
    deleteBattle,
    setWinnerByBattleId,
    getAllBattlesByStatus,
    updateScore,
    getDocsCount,
}