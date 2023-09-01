const { default: mongoose } = require("mongoose");
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
const deletePlaylistById = async(req, res, next) => {
    const id = req.body.id;

    try {
        const playlist = await playlistsModel.deletePlaylistById(id);
        return res.status(202).json({
            done: true,
            playlist,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// switch track in playlist
const switchTrackInPlaylist = async(req, res, next) => {
    const playlistId = req.body.playlistId;
    const trackId = new mongoose.Types.ObjectId(req.body.trackId);

    try {
        const playlist = await playlistsModel.swicthTrackInPlaylist(playlistId, trackId);
        let inPlaylist = playlist.tracks.indexOf(trackId) !== -1;
        return res.status(inPlaylist ? 201 : 202).json({
            done: true,
            playlistId,
            playlist,
            trackId,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// get playlists by title
const getPlaylistsByTitle = async(req, res, next) => {
    const title = req.query.title;

    try {
        const playlists = await playlistsModel.getPlaylistByTitle(title);
        return res.status(200).json({
            done: true,
            playlists,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// get by owner id
const getPlaylistByOwnerId = async(req, res, next) => {
    const ownerId = req.query.ownerId;
    const skipCount = req.query.skipCount;

    try {
        const playlists = await playlistsModel.getPlaylistByOwnerId(ownerId, skipCount);
        const count = await playlistsModel.getDocsCount({owner: ownerId});
        return res.status(200).json({
            done: true,
            count,
            playlists,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get by owner id
const getPublicAvailablePlaylists = async(req, res, next) => {
    const skipCount = req.query.skipCount;
    try {
        const playlists = await playlistsModel.getPublicAvailablePlaylists(skipCount);
        const count = await playlistsModel.getDocsCount({});
        return res.status(200).json({
            done: true,
            count,
            playlists,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    createPlaylist,
    deletePlaylistById,
    switchTrackInPlaylist,
    getPlaylistsByTitle,
    getPlaylistByOwnerId,
    getPublicAvailablePlaylists,
}


