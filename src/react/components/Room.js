const React = require('react');
const PropTypes = require('prop-types');
const _ = require('lodash');
const { Box, Toast } = require('grommet');
const { Link } = require('react-router-dom');
const { gql, graphql, compose } = require('react-apollo');
const SpotifyWebApi = require('spotify-web-api-js');
const env = process.env.NODE_ENV || 'development';
const { client_id, client_secret } = require('../../../config/config')[env];
const spotify = require('./spotify/spotify');
const urlparser = require('./utils/urlparser');
const { Loading } = require('./utils/Loading');
const spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret
});
const PLAYLIST_LIMIT = 5;
const MILLISECONDS = 1000;
const EXPIRES_IN = 3600;
const TRACK_LIMIT = 5;

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.stopRefresh = this.stopRefresh.bind(this);
        this.loadData = this.loadData.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);
        this.grabTracks = this.grabTracks.bind(this);
        this.grabTrack = this.grabTrack.bind(this);
        this.alertNewAccessToken = this.alertNewAccessToken.bind(this);

        this.state = { playlist: null, tracks: null, track: null };
    }

    loadData(q) {
        this.getAccessToken(_ => {
            this.getPlaylist(q);
        });
    }

    alertNewAccessToken(err, res) {
        if (err) { console.error(err); }
        else { console.info(res.access_token); }
    }

    getAccessToken(cb) {
        spotify.getAccessToken((err, res) => {
            if (res) {
                let { access_token } = res;
                this.access_token = access_token;
                spotifyApi.setAccessToken(access_token);
            }

            this.timeout_id = window.setTimeout(this.getAccessToken,
                res.expires_in * MILLISECONDS || EXPIRES_IN * MILLISECONDS, this.alertNewAccessToken);
            if (cb) { cb(err, res); }
        });
    }

    getPlaylist(q) {
        spotifyApi.searchPlaylists(q, {limit: PLAYLIST_LIMIT})
            .then(data => {
                let { playlists: { items } } = data;
                let playlist = _.sample(items);
                let url = urlparser.parse(playlist.href, [{key: 'owner_id', index: 3}, {key: 'playlist_id', index: 5}]);
                spotifyApi.getPlaylistTracks(url.owner_id, url.playlist_id, {offset: 50, limit: 50})
                    .then(data => {
                        this.grabTracks(data);
                        console.log(data);
                    });
            }, err => {
                console.error(err);
            });
    }

    grabTracks(playlist) {
        let { items } = playlist;
        this.tracks = _.map(_.sampleSize(items, TRACK_LIMIT), obj => obj.track);
        this.grabTrack(this.tracks);
    }

    grabTrack(tracks) {
        let track = _.sample(tracks);
        this.setState({ track });
    }

    stopRefresh() {
        window.clearTimeout(this.timeout_id);
    }

    componentDidMount() {
        this.loadData(this.props.match.params.type);
    }

    render() {
        //let { username_id, room_id, type } = this.props.match.params;
        if (!this.state.track) {
            return (
                <Loading message="Grabbing tracks"/>
            );
        } else {
            let iframeURI = 'https://open.spotify.com/embed?uri=' + this.state.track.uri;
            return (
                <Box justify='center' align='center'>
                    <Box margin='medium'>
                        <iframe src={iframeURI} frameBorder='0' allowTransparency='true'></iframe>
                    </Box>
                </Box>
            );
        }
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
