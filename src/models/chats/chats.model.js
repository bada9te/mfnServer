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

// insert msg
const swicthMessage = async(chatId, messageId) => {
    return await chatsModel.findOneAndUpdate(
        { _id: chatId },
        [
            { 
                $set: {
                    $cond: [
                        { $in: [messageId, "$messages"] },
                        { $setDifference: ["$messages", [messageId]] },
                        { $concatArrays: ["$messages", [messageId]] }
                    ]
                } 
            }
        ]
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
    swicthMessage,
    deleteChatById,
}