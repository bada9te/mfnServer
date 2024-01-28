const { default: mongoose } = require("mongoose");
const chatsModel = require("./chats.mongo")


// create
const createChat = async(chat) => {
    return await chatsModel.insertMany([chat]);
}

// get by id
const getChatById = async(id) => {
    return await chatsModel.findById(id, {
        '__v': 0,
    });
}

// get user related
const getUserRelatedChats = async(userId) => {
    return await chatsModel.find(
        { 
            $or: [{ owner: userId }, { participants: userId }] 
        }
    );
}

// get many by ids
const getManyChatsByIds = async(ids) => {
    return await chatsModel.find({_id: {"$in": ids}})
        .sort({createdAt: -1});
}

// update
const updateChat = async(id, what, value) => {
    return await chatsModel.findOneAndUpdate(
        { _id: id },
        { [what]: value },
        { new: true }
    );
}

// insert / remove participant
const switchParticipants = async(chatId, participants) => {
    participants = participants.map(i => new mongoose.Types.ObjectId(i));
    return await chatsModel.findOneAndUpdate(
        { _id: chatId },
        [
            {
                $set: {
                    participants: {
                        $cond: [
                            { $setIsSubset: [participants, "$participants"] },
                            { $setDifference: ["$participants", participants] },
                            { $concatArrays: ["$participants", participants] }
                        ]
                    }
                }
            }
        ],
        { new: true }
    );
}


// insert / remove msg
const swicthMessage = async(chatId, messageId) => {
    messageId = new mongoose.Types.ObjectId(messageId);
    return await chatsModel.findOneAndUpdate(
        { _id: chatId },
        [
            { 
                $set: {
                    messages: {
                        $cond: [
                            { $in: [messageId, "$messages"] },
                            { $setDifference: ["$messages", [messageId]] },
                            { $concatArrays: ["$messages", [messageId]] }
                        ]
                    }
                } 
            }
        ],
        { new: true }
    );
}

// delete 
const deleteChatById = async(id) => {
    return await chatsModel.findOneAndDelete({ _id: id, });
}


module.exports = {
    createChat,
    getChatById,
    getManyChatsByIds,
    getUserRelatedChats,
    updateChat,
    switchParticipants,
    swicthMessage,
    deleteChatById,
}