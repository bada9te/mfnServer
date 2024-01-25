const mongoose = require('mongoose');

// schema
const notificationsSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { select: '_id email nick avatar' },
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { select: '_id email nick avatar' },
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        autopopulate: true,
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true,
    },
    text: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

// autopopulate
notificationsSchema.plugin(require('mongoose-autopopulate'));

// model
const notificationsModel = mongoose.model('Notification', notificationsSchema);

// export
module.exports = notificationsModel;
