const mongoose = require('mongoose');
const commentsModel = require('../comments/comments.mongo');


// schema
const postsSchema = mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        autopopulate: { select: '_id email nick avatar' }
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    audio: { 
        type: String,
        required: true,
    }, 
    image: { 
        type: String,
        required: true,
    },
    likedBy: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }]  
    },
    savedBy: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }]  
    },
    comments: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Comment' 
        }],
    },
    category: {
        type: String,
        required: true,
    },
    downloadsAllowed: {
        type: Boolean,
        required: true,
    },
    commentsAllowed: {
        type: Boolean,
        required: true,
    }
}, {timestamps: true});

// plugin
postsSchema.plugin(require('mongoose-autopopulate'));

// cascade delete
postsSchema.pre('findOneAndDelete', async function(next) {
    const query = this.getQuery();
    const post = await this.model.findOne({ _id: query._id });
    if (post && post?.comments?.length > 0) {
        await commentsModel.deleteMany({ _id: post.comments }).exec();
    }
    next();
});

postsSchema.pre('deleteMany', async function(next) {
    const query = this.getQuery();
    const posts = await this.model.find({ owner: query.owner });

    posts.forEach(async(post) => {
        if (post && post?.comments?.length > 0) {
            await commentsModel.deleteMany({ _id: post.comments }).exec();
        }
    });
    next();
});

// model 
const postsModel = mongoose.model('Post', postsSchema);


// export
module.exports = postsModel;