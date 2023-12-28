const mongoose = require("mongoose");
const data = require("../testData");
const request = require("supertest");
const app = require("../../src/app");
const { PLAYLIST_CREATE_MUTATION, PLAYLISTS_BY_TITLE_QUERY, PLAYLISTS_BY_OWNER_ID_QUERY, PLAYLISTS_PUBLIC_AVAILABLE_QUERY, PLAYLIST_SWITCH_TRACK_MUTATION, PLAYLIST_DELETE_BY_ID_MUTATION } = require("./playlist.gql");


const GQL_PATH = '/graphql';


describe("Playlist tests", () => {
    beforeAll(() => {
        require("../../src/server");
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    it("Create playlist", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(PLAYLIST_CREATE_MUTATION({
                owner: data.user._id,
                title: "test",
                public: true,
            }));
        const playlist = body.data.playlistCreate;
        data.playlist._id = playlist._id;
        data.playlist.title = playlist.title;
        expect(statusCode).toBe(200);
        expect(playlist.public).toBe(true);
        expect(playlist.title).toBe("test");
    });

    it("Get playlists by title", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(PLAYLISTS_BY_TITLE_QUERY(data.playlist.title));
        expect(statusCode).toBe(200);
        expect(body.data.playlistsByTitle.length).not.toBe(0);
    });

    it("Get playlists by owner id", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(PLAYLISTS_BY_OWNER_ID_QUERY(data.user._id, 0, 12));
        expect(statusCode).toBe(200);
        expect(body.data.playlistsByOwnerId.playlists.length).not.toBe(0);
    });

    it("Get public available playlists, expecting to get 1 or more", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(PLAYLISTS_PUBLIC_AVAILABLE_QUERY(0, 12));
        expect(statusCode).toBe(200);
        expect(body.data.playlistsPublicAvailable.playlists.length).not.toBe(0);
    });

    it("Append track (post) into playlist", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(PLAYLIST_SWITCH_TRACK_MUTATION({
                playlistId: data.playlist._id,
                trackId: data.post1._id,
            }));   
        expect(statusCode).toBe(200);
        expect(body.data.playlistSwicthTrack.tracks).toContainEqual({"_id": data.post1._id.toString()})
    });

    it("Remove track (post) from playlist", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(PLAYLIST_SWITCH_TRACK_MUTATION({
                playlistId: data.playlist._id,
                trackId: data.post1._id,
            }));   
        expect(statusCode).toBe(200);
        expect(body.data.playlistSwicthTrack.tracks.length).toBe(0);
    });

    it("Delete playlist", async() => {
        const { statusCode, body } = await request(app)
            .post(GQL_PATH)
            .send(PLAYLIST_DELETE_BY_ID_MUTATION(data.playlist._id));   
        expect(statusCode).toBe(200);
        expect(body.data.playlistDeleteById._id).toBe(data.playlist._id.toString());
    });
});