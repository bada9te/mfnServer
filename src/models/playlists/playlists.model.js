const Playlist = require("./playlists.mongo");


// create
const createPlaylist = async(playlist) => {
    return await Playlist.insertMany(playlist)
    .catch(err => {
        throw new err(err);
    });
}

// delete by id
const deletePlaylistById = async(id) => {
    return await Playlist.findByIdAndDelete(id)
    .catch(err => {
        throw new err(err);
    });
}

// append track
const swicthTrackInPlaylist = async(playlistId, trackId) => {
    return await Playlist.findOneAndUpdate(
        { _id: playlistId }, 
        [{
            $set: {
                tracks: {
                    $cond: [
                        { $in: [trackId, "$tracks"] },
                        { $setDifference: ["$tracks", [trackId]] },
                        { $concatArrays: ["$tracks", [trackId]] }
                    ]
                }
            }
        }],
        { new: true }
    )
    .catch(err => {
        throw new err(err);
    });
}

// get by title
const getPlaylistByTitle = async(title) => {
    return await Playlist.find({ title: {$regex: '.*' + title + '.*'} })
    .limit(10)
    .catch(err => {
        throw new Error(err);
    });
}

// get by owner id
const getPlaylistByOwnerId = async(ownerId) => {
    return await Playlist.find({ owner: ownerId })
    .catch(err => {
        throw new Error(err);
    });
}

// get all public
const getPublicAvailablePlaylists = async() => {
    return await Playlist.find({ public: true })
    .catch(err => {
        throw new Error(err);
    });
}


module.exports = {
    createPlaylist,
    deletePlaylistById,
    swicthTrackInPlaylist,
    getPlaylistByTitle,
    getPlaylistByOwnerId,
    getPublicAvailablePlaylists
}