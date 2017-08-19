const React = require('react');
const PropTypes = require('prop-types');
const { Box, Toast } = require('grommet');
//const { Link } = require('react-router-dom');
const { gql, graphql, compose } = require('react-apollo');
var env = process.env.NODE_ENV || 'development';
const { client_id, client_secret } = require('../../../config/config')[env];
const spotify = require('./spotify/spotify');
const urlparser = require('./utils/urlparser');
const SpotifyWebApi = require('spotify-web-api-js');
const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret
});

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.stopRefresh = this.stopRefresh.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);

        this.state = { tracks: null };
    }

    loadData(q) {
        this.getAccessToken(_ => {
            this.getPlaylist(q);
        });
    }

    getAccessToken(cb) {
        spotify.getAccessToken((err, { access_token, expires_in }) => {
            this.access_token = access_token;
            spotifyApi.setAccessToken(access_token);
            this.timeout_id = window.setTimeout(this.getAccessToken, expires_in*10);
            if (cb) { cb(); }
        });
    }

    getPlaylist(q) {
        spotifyApi.searchPlaylists(q, {limit: 2})
            .then(data => {
                let { playlists: { items } } = data;
                let { id } = items[1];
                let url = urlparser.parse(items[1].href, [{key: 'owner_id', index: 3}, {key: 'playlist_id', index: 5}]);
                spotifyApi.getPlaylistTracks(url.owner_id, url.playlist_id)
                    .then(data => {
                        this.setState({ tracks: data });
                        console.log(data);
                    });
            }, err => {
                console.error(err);
            });
    }

    stopRefresh() {
        window.clearTimeout(this.timeout_id);
    }

    componentDidMount() {
        this.loadData(this.props.match.params.type);
    }

    render() {
        //let { username_id, room_id, type } = this.props.match.params;
        return (
            <Box>
                <Toast status='ok' onClose={(_) => _ }>
                    Setup Complete
                </Toast>
            </Box>
        );
    }
}

Room.propTypes = {
    match: PropTypes.object.isRequired
};

const RoomAndUserQuery = gql`query RoomAndUserQuery($username_id: ID!, $room_id: ID!) {
    User(id: $username_id) {
        _id
        username
        score
    }

    Room(id: $room_id) {
        passcode
        name
        guests {
            _id
            username
            score
        }
    }

    AccessToken {
        access_token
    }
}`;

const GQLRoom = compose(
    graphql(RoomAndUserQuery, {
        props: ({ownProps, data: {loading, User, Room, AccessToken}}) => ({loading, User, Room, AccessToken}),
        options: (props) => ({
            variables: {
                username_id: props.match.params.username_id,
                room_id: props.match.params.room_id
            }
        })
    })
)(Room);

export { GQLRoom as Room };
