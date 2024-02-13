const mongoose = require('mongoose');

const chatMessagesSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { select: '_id email nick avatar' }
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    text: {
        type: String,
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage',
        autopopulate: true,
    },
}, {timestamps: true});

// plugin
chatMessagesSchema.plugin(require('mongoose-autopopulate'));

// model
const chatMessagesModel = mongoose.model('ChatMessage', chatMessagesSchema);

module.exports = chatMessagesModel;