import mongoose from "mongoose";

// schema
const playlistsSchema: mongoose.Schema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: { select: '_id email nick avatar' }
    },
    title: {
        type: String,
        required: true,
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        autopopulate: true,
    }],
    public: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

// autopopulate plugin
playlistsSchema.plugin(require('mongoose-autopopulate'));

// model
const playlistsModel = mongoose.model("Playlist", playlistsSchema);

// export
export default playlistsModel;
