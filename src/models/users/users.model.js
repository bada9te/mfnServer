const { default: mongoose } = require('mongoose');
const User = require('./users.mongo');

/*
const file = await fileModel.getFile("64296620726cf61f011540e9")
    user.avatar = file._doc._id;
    await updateUser(user);
*/ 
// add new user
const addUser = async(user) => {
    return await User.insertMany([user])
    .catch((err) => { 
        throw new Error(err); 
    });
}

// remove user by email
const deleteUserById = async(id) => {
    return await User.findOneAndDelete({
        _id: id,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// update user
const updateUser = async(id, value, what) => {
    return await User.findOneAndUpdate({
        _id: id,
    }, { 
        [what]: value,
    }, {
        new: true,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// get user by email
const getUserByEmail = async(email) => {
    return await User.findOne({ 'local.email': email }, { '__v': 0 })
    .catch((err) => {
        throw new Error(err);
    });
}

// get by id
const getUserById = async(id) => {
    return await User.findById(id, { '__v': 0 })
    .catch((err) => {
        throw new Error(err);
    });
}

// get by ids array
const getUsersByIds = async(ids) => {
    return await User.find({_id: {"$in": ids}}, {
        'password': 0,
        'verifyToken': 0,
        '__v': 0,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// get all
const getAllUsers = async() => {
    return await User.find({}, {
        'verifyToken': 0,
        'password': 0,
        '__v': 0,
    })
    .catch(err => {
        throw new Error(err);
    });
}

// get by nickname 
const getByNickname = async(nickname) => {
    return await User.find({
        nick: { $regex: '.*' + nickname + '.*' }
    }, {
        'verifyToken': 0,
        'password': 0,
        '__v': 0,
    })
    .catch((err) => {
        throw new Error(err);
    })
}

const getOnlyImagesAndAudios = async() => {
    return await User.find(
        {},
        { 'avatar': 1, 'background': 1 }
    )
    .catch((err) => {
        throw new Error(err);
    });
}

const switchSubscriptionOnUser = async(subscriberId, userId) => {
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
    .catch(err => {
        throw new Error(err);
    });
}

const switchSubscribedOnUser = async(subscriberId, userId) => {
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
    .catch(err => {
        throw new Error(err);
    });
}


// confirm account creation
const confirmAccount = async(userId) => {
    return await User.findOneAndUpdate(
        { _id: userId },
        { verified: true },
        { new: true }
    )
    .catch(err => {
        throw new Error(err);
    });
}

// restore account
const restoreAccount = async(userId, newValue, type) => {
    return await User.findOneAndUpdate(
        { _id: userId },
        { [type]: newValue },
        { new: true },
    )
    .catch(err => {
        throw new Error(err);
    });
}







module.exports = {
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
