const mongoose = require('mongoose');


// schema
const reportsSchema = mongoose.Schema({
    contactReason: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    reportOwner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        autopopulate: true,
        required: true,
    },
        
    reportedPost: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post',
        autopopulate: true,
    },
    isClosed: {
        type: Boolean,
    },
});

// plugin
reportsSchema.plugin(require('mongoose-autopopulate'));

// model 
const reportsModel = mongoose.model('Report', reportsSchema);

// export
module.exports = reportsModel;