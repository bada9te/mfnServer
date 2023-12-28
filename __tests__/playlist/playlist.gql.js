module.exports = {
    PLAYLISTS_BY_TITLE_QUERY: (title) => ({
        query: `query playlistsByTitle($title: String!) {
            playlistsByTitle(title: $title) {
                _id
            }
        }`,
        variables: {
            title
        }
    }),
    PLAYLISTS_BY_OWNER_ID_QUERY: (owner, offset, limit) => ({
        query: `query playlistsByOwnerId($owner: ID!, $offset: Int!, $limit: Int!) {
            playlistsByOwnerId(owner: $owner, offset: $offset, limit: $limit) {
                playlists {
                    _id
                }
                count
            }
        }`,
        variables: {
            owner, offset, limit
        }
    }),
    PLAYLISTS_PUBLIC_AVAILABLE_QUERY: (offset, limit) => ({
        query: `query playlistsPublicAvailable($offset: Int!, $limit: Int!) {
            playlistsPublicAvailable(offset: $offset, limit: $limit) {
                playlists {
                    _id
                }
                count
            }
        }`,
        variables: {
            offset, limit
        }
    }),

    PLAYLIST_CREATE_MUTATION: (input) => ({
        query: `mutation playlistCreate($input: CreatePlaylistInput!) {
            playlistCreate(input: $input) {
                _id
                title
                public
            }
        }`,
        variables: {
            input
        }
    }),
    PLAYLIST_SWITCH_TRACK_MUTATION: (input) => ({
        query: `mutation playlistSwicthTrack($input: SwitchTrackInPlaylistInput!) {
            playlistSwicthTrack(input: $input) {
                _id
                tracks {
                    _id
                }
            }
        }`,
        variables: {
            input
        }
    }),
    PLAYLIST_DELETE_BY_ID_MUTATION: (id) => ({
        query: `mutation playlistDeleteById($_id: ID!) {
            playlistDeleteById(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),
}