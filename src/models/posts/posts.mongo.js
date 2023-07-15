const mongoose = require('mongoose');


// schema
const postsSchema = mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        autopopulate: true 
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
    createdAt: {
        type: Date,
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
});

// plugin
postsSchema.plugin(require('mongoose-autopopulate'));

// model 
const postsModel = mongoose.model('Post', postsSchema);


// export
module.exports = postsModel;