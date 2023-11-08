const mongoose = require('mongoose');


// schema
const reportsSchema = mongoose.Schema({
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
        autopopulate: true,
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
module.exports = reportsModel;