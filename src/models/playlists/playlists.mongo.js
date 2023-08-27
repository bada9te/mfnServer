const mongoose = require("mongoose");

// schema
const playlistsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    public: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});


// model
const playlistsModel = mongoose.model("Playlist", playlistsSchema);

// export
module.exports = playlistsModel;
