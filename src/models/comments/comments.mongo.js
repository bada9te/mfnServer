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
}, {timestamps: true});

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

commentsSchema.pre('deleteMany', async function(next) {
    const query = this.getQuery(); // array of ids in query._id
    const comments = await this.model.find({ _id: query._id });

    comments.forEach(async(comment) => {
        if (comment && !comment.isReply && comment?.replies?.length > 0) {
            await this.model.deleteMany({ _id: comment.replies }).exec();
        }
    });
    next();
});

// model
const commentsModel = mongoose.model('Comment', commentsSchema);

// export
module.exports = commentsModel;
