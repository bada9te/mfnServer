const playlistsModel = require("../models/playlists/playlists.model");

const createPlaylistDB = async(playlist) => {
    let createdPlaylist;
    await playlistsModel.createPlaylist(playlist)
        .then(data => {
            createdPlaylist = data[0];
        });
    
    return createdPlaylist;
}

const deletePlaylistByIdDB = async(id) => {
    return await playlistsModel.deletePlaylistById(id);
}

const switchTrackInPlaylistDB = async(playlistId, trackId) => {
    return await playlistsModel.swicthTrackInPlaylist(playlistId, trackId);
}

const getPlaylistsByTitleDB = async(title) => {
    return await playlistsModel.getPlaylistByTitle(title);
}

const getPlaylistsByOwnerIdDB = async(ownerId, range) => {
    return {
        playlists: await playlistsModel.getPlaylistByOwnerId(ownerId, range),
        count: await playlistsModel.getDocsCount({owner: ownerId})
    }
}

const getPublicAvailablePlaylistsDB = async(range) => {
    return {
        playlists: await playlistsModel.getPublicAvailablePlaylists(range),
        count: await playlistsModel.getDocsCount({})
    }
}

module.exports = {
    createPlaylistDB,
    deletePlaylistByIdDB,
    switchTrackInPlaylistDB,
    getPlaylistsByTitleDB,
    getPlaylistsByOwnerIdDB,
    getPublicAvailablePlaylistsDB,
}