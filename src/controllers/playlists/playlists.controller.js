const playlistsModel = require("../../models/playlists/playlists.model");


// create 
const createPlaylist = async(req, res, next) => {
    const playlist = req.body.playlist;

    try {
        await playlistsModel.createPlaylist(playlist);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// delete
const deletePlaylistById = async(req, res) => {
    const id = req.body.id;

    try {
        const playlist = await playlistsModel.deletePlaylistById(id);
        return res.status(202).json({
            done: true,
            playlist: playlist,
        });
    } catch (error) {
        error.status = 400;
        return next(err);
    }
}


// switch track in playlist
const switchTrackInPlaylist = async(req, res) => {
    const playlistId = req.body.playlistId;
    const trackId = req.body.trackId;

    try {
        const playlist = await playlistsModel.swicthTrackInPlaylist(playlistId, trackId);
        let inPlaylist = playlist.tracks.indexOf(trackId) !== -1;
        return res.status(inPlaylist ? 201 : 202).json({
            done: true,
            playlistId: playlistId,
            trackId: trackId,
        });
    } catch (error) {
        error.status = 400;
        return next(err);
    }
}


module.exports = {
    createPlaylist,
    deletePlaylistById,
    switchTrackInPlaylist,
}


