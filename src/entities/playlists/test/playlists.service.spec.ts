import mongoose, { Model } from "mongoose";
import { PlaylistsService } from "../playlists.service";
import { Playlist } from "../playlists.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

describe('PlaylistsService', () => {
    let playlistsService: PlaylistsService;
    let model: Model<Playlist>;

    const mockPlaylist = {
        _id: "66d434125a960f3fe329a338",
        owner: {
            _id: "96d434125a960f3fe129a311",
        },
        tracks: [
            { _id: "16d434125a960f3fe129a311" }, 
            { _id: "26d434125a960f3fe129a311" }, 
            { _id: "36d434125a960f3fe129a311" },
        ],
        public: true,
        title: "test",
    };

    const mockPlaylistModel = {
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findOneAndUpdate: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlaylistsService,
                { provide: getModelToken(Playlist.name), useValue: mockPlaylistModel },
            ]
        }).compile();

        playlistsService = module.get<PlaylistsService>(PlaylistsService);
        model = module.get<Model<Playlist>>(getModelToken(Playlist.name));
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    describe('getPlaylistById', () => {
        it('should find and return a playlist by id', async() => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockPlaylist);

            const res = await playlistsService.getPlaylistById(mockPlaylist._id);
            expect(model.findById).toHaveBeenCalledWith(mockPlaylist._id);
            expect(res).toEqual(mockPlaylist);
        });
    });

    describe('createPlaylist', () => {
        it('should create and return created playlist', async() => {
            jest.spyOn(model, 'create').mockImplementation(() => Promise.resolve(mockPlaylist as any));

            const input = {
                owner: mockPlaylist.owner._id,
                title: "test",
                public: false,
            };
            const res = await playlistsService.createPlaylist(input);
            expect(model.create).toHaveBeenCalledWith(input);
            expect(res).toEqual(mockPlaylist);
        });
    });

    describe('deletePlaylistById', () => {
        it('should find and delete playlist by id', async() => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockPlaylist);

            const res = await playlistsService.deletePlaylistById(mockPlaylist._id);
            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockPlaylist._id);
            expect(res).toEqual(mockPlaylist);
        });
    });

    describe('swicthTrackInPlaylist', () => {
        it('should switch track in playlist', async() => {
            jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(mockPlaylist);

            const trackIdMongo = new mongoose.Types.ObjectId(mockPlaylist.tracks[0]._id);
            const res = await playlistsService.swicthTrackInPlaylist(mockPlaylist._id, mockPlaylist.tracks[0]._id);
            expect(model.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockPlaylist._id }, 
                [{
                    $set: {
                        tracks: {
                            $cond: [
                                { $in: [trackIdMongo, "$tracks"] },
                                { $setDifference: ["$tracks", [trackIdMongo]] },
                                { $concatArrays: ["$tracks", [trackIdMongo]] }
                            ]
                        }
                    }
                }],
                { new: true }
            );
            expect(res).toEqual(mockPlaylist);
        });
    });

    describe('getPlaylistByTitle', () => {
        it('should get playlists list by title', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                limit: jest.fn().mockResolvedValue([mockPlaylist]),
            } as any));

            const res = await playlistsService.getPlaylistByTitle(mockPlaylist.title);
            expect(model.find).toHaveBeenCalledWith({ 
                title: {
                    $regex: '.*' + mockPlaylist.title + '.*'
                } 
            });;
            expect(res).toEqual([mockPlaylist]);
        });
    });

    describe('getPlaylistByOwnerId', () => {
        it('should get playlists list by owner id', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        sort: jest.fn().mockResolvedValue([mockPlaylist]),
                    }),
                }),
            } as any));

            const res = await playlistsService.getPlaylistByOwnerId(
                mockPlaylist.owner._id, 
                { offset: 0, limit: 6 },
            );
            expect(model.find).toHaveBeenCalledWith({ 
                owner: mockPlaylist.owner._id,
            });
            expect(res).toEqual([mockPlaylist]);
        });
    });

    describe('getPublicAvailablePlaylists', () => {
        it('should find and return a list of public playlists', async() => {
            jest.spyOn(model, 'find').mockImplementation(() => ({
                skip: () => ({
                    limit: () => ({
                        sort: jest.fn().mockResolvedValue([mockPlaylist]),
                    }),
                }),
            } as any));

            const res = await playlistsService.getPublicAvailablePlaylists({
                offset: 0, limit: 6,
            });

            expect(model.find).toHaveBeenCalledWith({ public: true });
            expect(res).toEqual([mockPlaylist]);
        });
    });
});