import mongoose from "mongoose";
import User from './users.mongo';
import { TNewUser } from "./types";

/*
const file = await fileModel.getFile("64296620726cf61f011540e9")
    user.avatar = file._doc._id;
    await updateUser(user);
*/ 
// add new user
const addUser = async(user: TNewUser) => {
    return await User.insertMany([user])
}

// remove user by email
const deleteUserById = async(id: string) => {
    return await User.findOneAndDelete({
        _id: id,
    })
}

// update user
const updateUser = async(id: string, value: any, what: string) => {
    return await User.findOneAndUpdate({
        _id: id,
    }, { 
        [what]: value,
    }, {
        new: true,
    })
}

// get user by email
const getUserByEmail = async(email: string) => {
    return await User.findOne({ 'local.email': email }, { '__v': 0 })
}

// get by id
const getUserById = async(id: string) => {
    return await User.findById(id, { '__v': 0 })
}

// get by ids array
const getUsersByIds = async(ids: string[]) => {
    return await User.find({_id: {"$in": ids}}, {
        'password': 0,
        'verifyToken': 0,
        '__v': 0,
    })
}

// get all
const getAllUsers = async() => {
    return await User.find({}, {
        'verifyToken': 0,
        'password': 0,
        '__v': 0,
    })
}

// get by nickname 
const getByNickname = async(nickname: string) => {
    return await User.find({
        nick: { $regex: '.*' + nickname + '.*' }
    }, {
        'verifyToken': 0,
        'password': 0,
        '__v': 0,
    })
}

const getOnlyImagesAndAudios = async() => {
    return await User.find(
        {},
        { 'avatar': 1, 'background': 1 }
    )
}

const switchSubscriptionOnUser = async(subscriberId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId) => {
    subscriberId = new mongoose.Types.ObjectId(subscriberId);
    userId       = new mongoose.Types.ObjectId(userId);
    return await User.findOneAndUpdate(
        { _id: userId }, 
        [{ 
            $set: {
                subscribers: {
                    $cond: [
                        { $in: [subscriberId, "$subscribers"] },
                        { $setDifference: ["$subscribers", [subscriberId]] },
                        { $concatArrays: ["$subscribers", [subscriberId]] }
                    ]
                }
            }
        }],
        { new: true }
    )
}

const switchSubscribedOnUser = async(subscriberId: string | mongoose.Types.ObjectId, userId: string | mongoose.Types.ObjectId) => {
    subscriberId = new mongoose.Types.ObjectId(subscriberId);
    userId       = new mongoose.Types.ObjectId(userId);
    return await User.findOneAndUpdate(
        { _id: subscriberId }, 
        [{ 
            $set: {
                subscribedOn: {
                    $cond: [
                        { $in: [userId, "$subscribedOn"] },
                        { $setDifference: ["$subscribedOn", [userId]] },
                        { $concatArrays: ["$subscribedOn", [userId]] }
                    ]
                }
            }
        }],
        { new: true }
    )
}


// confirm account creation
const confirmAccount = async(userId: string) => {
    return await User.findOneAndUpdate(
        { _id: userId },
        { verified: true },
        { new: true }
    )
}

// restore account
const restoreAccount = async(userId: string, newValue: any, type: string) => {
    return await User.findOneAndUpdate(
        { _id: userId },
        { [type]: newValue },
        { new: true },
    )
}


export {
    addUser,
    deleteUserById,
    updateUser,
    getUserByEmail,
    getUserById,
    getUsersByIds,
    getAllUsers,
    getByNickname,
    getOnlyImagesAndAudios,
    switchSubscriptionOnUser,
    switchSubscribedOnUser,
    confirmAccount,
    restoreAccount,
}
