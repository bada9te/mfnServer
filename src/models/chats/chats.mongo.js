const mongoose = require('mongoose');

// schema
const chatsSchema = mongoose.Schema({
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
const chatsModel = mongoose.Model('Chat', chatsSchema);

module.exports = chatsModel;