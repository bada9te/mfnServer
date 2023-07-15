const mongoose = require('mongoose');


// schema
const commentsSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    isReply: {
        type: Boolean,
        default: false,
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true,
    }],
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
});

// plugin 
commentsSchema.plugin(require('mongoose-autopopulate'));

// model
const commentsModel = mongoose.model('Comment', commentsSchema);

// export
module.exports = commentsModel;