const mongoose = require('mongoose');


// schema
const supportRequestsSchema = mongoose.Schema({
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
    isClosed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// plugin
supportRequestsSchema.plugin(require('mongoose-autopopulate'));

// model 
const supportRequestsModel = mongoose.model('SupportRequest', supportRequestsSchema);

// export
module.exports = supportRequestsModel;