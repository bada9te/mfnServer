import mongoose from 'mongoose';


// schema
const battlesSchema: mongoose.Schema = new mongoose.Schema({
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
}, {timestamps: true});

// plugin
battlesSchema.plugin(require('mongoose-autopopulate'));

// model 
const battlesModel = mongoose.model('Battle', battlesSchema);

// export
export default battlesModel;