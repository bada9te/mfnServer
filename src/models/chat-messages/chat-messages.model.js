const { default: mongoose } = require("mongoose");
const chatMessagesModel = require("./chat-messages.mongo")


// create msg
const createMessage = async(message) => {
    return await chatMessagesModel.insertMany([message]);
}

// delete 
const deleteMessageById = async(id) => {
    return await chatMessagesModel.findOneAndDelete({ _id: id });
}

// update
const updateMessage = async(id, value) => {
    return await chatMessagesModel.findOneAndUpdate({ _id: id }, { text: value }, { new: true });
}

// get by id
const getMessageById = async(id) => {
    return await chatMessagesModel.findById(id, {
        '__v': 0
    });
}

// get chat messages 
const getMessagesByChat = async(chatId, range) => {
    return await chatMessagesModel.find({ chat: chatId, isReply: false })
        .sort({ createdAt: -1 })
        .skip(range.offset)
        .limit(range.limit)
}

// switch in msg replies 
const switchMessageInReplies = async(messageId, replyingMessageId) => {
    replyingMessageId = new mongoose.Types.ObjectId(replyingMessageId)
    return await chatMessagesModel.findOneAndUpdate({_id: messageId}, [{
        $set: {
            replies: {
                $cond: [
                    { $in: [replyingMessageId, "$replies" ] },
                    { $setDifference: ["$replies", [replyingMessageId]] },
                    { $concatArrays: ["$replies", [replyingMessageId]] }
                ]
            }
        },
    }], { new: true });
}

module.exports = {
    createMessage,
    deleteMessageById,
    updateMessage,
    getMessageById,
    getMessagesByChat,
    switchMessageInReplies,
}