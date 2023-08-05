const mongoose = require('mongoose');
const postsModel = require('../posts/posts.mongo');


// schema
const usersSchema = mongoose.Schema({
    nick: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '...',
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: { 
        type: String, 
        default: '',
    }, 
    background: { 
        type: String, 
        default: '',
    },
    subscribers: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }]
    },
    subscribedOn: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }]
    },
    createdAt: {
        type: Date,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// plugin
usersSchema.plugin(require('mongoose-autopopulate'));


// cascade delete
usersSchema.pre('deleteOne', async function(next) {
    const query = this.getQuery();
    const user = await this.model.findOne({ _id: query._id });
    if (user) {
        await postsModel.deleteMany({ owner: user._id });
    }
    next();
});


// model
const User = mongoose.model('User', usersSchema);


// export
module.exports = User;