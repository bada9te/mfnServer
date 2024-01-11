const mongoose = require('mongoose');
const postsModel = require('../posts/posts.mongo');
const bcrypt = require('bcrypt-nodejs');


// schema
const usersSchema = mongoose.Schema({
    local: {
        email: String,
        password: String,
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        email: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    nick: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '...',
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
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {timestamps: true});

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

// generating a hash
usersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
usersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// model
const User = mongoose.model('User', usersSchema);


// export
module.exports = User;