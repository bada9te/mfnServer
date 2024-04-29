import mongoose from 'mongoose';


// schema
const reportsSchema: mongoose.Schema = new mongoose.Schema({
    contactReason: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    reportOwner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        autopopulate: { select: '_id email nick avatar' },
        required: false,
    },
    reportedPost: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        autopopulate: true,
    },

    reportedComment: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment',
        autopopulate: true,
    },
    isClosed: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

// plugin
reportsSchema.plugin(require('mongoose-autopopulate'));

// model 
const reportsModel = mongoose.model('Report', reportsSchema);

// export
export default reportsModel;