const mongoose = require('mongoose');


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
    aboutMe: {
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
    notifications: {
        type: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Notification' 
        }],
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// plugin
usersSchema.plugin(require('mongoose-autopopulate'));


// model
const User = mongoose.model('User', usersSchema);


// export
module.exports = User;