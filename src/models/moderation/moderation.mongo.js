const mongoose = require('mongoose');

const moderationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true, 
    },
    type: {
        type: String,
        required: true,
    },
    verifyToken: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const Moderation = mongoose.model('Moderation', moderationSchema);

module.exports = Moderation;