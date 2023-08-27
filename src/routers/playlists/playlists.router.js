const express = require("express");
const passport = require("passport");
const playlistsController = require("../../controllers/playlists/playlists.controller");


// router instacne
const playlistsRouter = express.Router();


// endpoints
playlistsRouter.post('/create',       passport.authenticate("jwt", {session: false}), playlistsController.createPlaylist);
playlistsRouter.post('/delete',       passport.authenticate("jwt", {session: false}), playlistsController.deletePlaylistById);
playlistsRouter.post('/switch-track', passport.authenticate("jwt", {session: false}), playlistsController.switchTrackInPlaylist);

playlistsRouter.get ('/owner', playlistsController.getPlaylistByOwnerId);
playlistsRouter.get ('/title', playlistsController.getPlaylistsByTitle);
playlistsRouter.get ('/public-available', playlistsController.getPublicAvailablePlaylists);

// export
module.exports = playlistsRouter;
