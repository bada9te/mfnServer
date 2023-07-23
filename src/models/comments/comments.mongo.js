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

// cascade remove
commentsSchema.pre('findOneAndDelete', async function (next) {
    const query = this.getQuery();
    const comment = await this.model.findOne({ _id: query._id });
    if (comment && comment?.replies?.length > 0) {
        await this.model.deleteMany({ _id: comment.replies }).exec();
    }
    next();
});

// model
const commentsModel = mongoose.model('Comment', commentsSchema);

// export
module.exports = commentsModel;