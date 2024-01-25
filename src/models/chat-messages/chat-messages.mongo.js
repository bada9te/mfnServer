const mongoose = require('mongoose');

const chatMessagesSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { select: '_id email nick avatar' }
    },
    text: {
        type: String,
        required: true
    },
    isReply: {
        type: Boolean,
        default: false,
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage',
        autopopulate: true,
    }],
});

// plugin
chatMessagesSchema.plugin(require('mongoose-autopopulate'));

// model
const chatMessagesModel = mongoose.Model('ChatMessage', chatMessagesSchema);

module.exports = chatMessagesModel;