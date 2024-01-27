const mongoose = require('mongoose');

// schema
const chatsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { select: '_id email nick avatar' }
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { select: '_id email nick avatar' },
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage',
    }],
}, {timestamps: true});

// plugin
chatsSchema.plugin(require('mongoose-autopopulate'));

// model
const chatsModel = mongoose.model('Chat', chatsSchema);

module.exports = chatsModel;