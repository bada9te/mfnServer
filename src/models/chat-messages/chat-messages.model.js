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
    return await chatMessagesModel.findOmeAndUpdate(
        { _id: id },
        { text: value },
        { new: true }
    );
}

// get by id
const getMessageById = async(id) => {
    return await chatMessagesModel.findById(id, {
        '__v': 0
    });
}

// get chat messages 
const getMessagesByChat = async(chatId, range) => {
    return await chatMessagesModel.find({ chat: chatId })
        .skip(range.offset)
        .limit(range.limit)
        .sort({ createdAt: -1 })
}