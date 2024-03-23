import mongoose from "mongoose";
import Playlist from "./playlists.mongo";
import { TNewPlaylist } from "./types";
import { TRange } from "../types";


// create
const createPlaylist = async(playlist: TNewPlaylist) => {
    return await Playlist.insertMany([playlist], { populate: "owner" })
}

// delete by id
const deletePlaylistById = async(id: string) => {
    return await Playlist.findByIdAndDelete(id)
}

// append track
const swicthTrackInPlaylist = async(playlistId: string, trackId: string | mongoose.Types.ObjectId) => {
    trackId = new mongoose.Types.ObjectId(trackId);
    return await Playlist.findOneAndUpdate({ _id: playlistId }, [{
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
}

// get by title
const getPlaylistByTitle = async(title: string) => {
    return await Playlist.find({ title: {$regex: '.*' + title + '.*'} })
    .limit(12)
}

// get by owner id
const getPlaylistByOwnerId = async(ownerId: string, range: TRange) => {
    return await Playlist.find({ owner: ownerId })
    .skip(range.offset)
    .limit(range.limit)
    .sort({ createdAt: -1 })
}

// get all public
const getPublicAvailablePlaylists = async(range: TRange) => {
    return await Playlist.find({ public: true })
    .skip(range.offset)
    .limit(range.limit)
    .sort({ createdAt: -1 })
}

// count docs
const getDocsCount = async(filter: any) => {
    return await Playlist.count(filter)
}


export {
    createPlaylist,
    deletePlaylistById,
    swicthTrackInPlaylist,
    getPlaylistByTitle,
    getPlaylistByOwnerId,
    getPublicAvailablePlaylists,
    getDocsCount,
}