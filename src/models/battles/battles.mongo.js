const mongoose = require('mongoose');


// schema
const battlesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    post1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        autopopulate: true,
    },
    post2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        autopopulate: true,
    },
    post1Score: {
        type: Number,
        default: 0,
    },
    post2Score: {
        type: Number,
        default: 0,
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    createdAt: {
        type: Date,
        required: true,
    },
    willFinishAt: {
        type: Date,
        required: true,
    },
    finished: {
        type: Boolean,
        default: false,
    },
    votedBy: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }]
    }
});

// plugin
battlesSchema.plugin(require('mongoose-autopopulate'));

// model 
const battlesModel = mongoose.model('Battle', battlesSchema);

// export
module.exports = battlesModel;