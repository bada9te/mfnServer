import mongoose from 'mongoose';

const chatMessagesSchema: mongoose.Schema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true,
    },
    // for type text
    text: { type: String },
    // for type photo
    image: { type: String },
    // for type video
    video: { type: String },
    // for type audio
    audio: { type: String },
    // for type file
    file: { type: String },
    // for type spotify
    spotify: { type: String },
    // text
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

export default chatMessagesModel;