import mongoose from 'mongoose';

// schema
const chatsSchema:mongoose.Schema = new mongoose.Schema({
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
    messagesUnreadCount: {
        type: [{
            count: Number,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
        default: []
    },
}, {timestamps: true});

// plugin
chatsSchema.plugin(require('mongoose-autopopulate'));

// model
const chatsModel = mongoose.model('Chat', chatsSchema);

export default chatsModel;