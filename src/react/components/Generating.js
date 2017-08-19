const React = require('react');
const { gql, graphql, compose } = require('react-apollo');
const { Toast, Box } = require('grommet');
const PropTypes = require('prop-types');
const { GQLWrapper } = require('./utils/GQLWrapper');
const { Loading } = require('./utils/Loading');

class Generating extends React.Component {
    constructor(props) {
        super(props);
        this.generateRoom = this.generateRoom.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = { generated: false, error: false };
    }

    generateRoom() {
        let username_id = this.props.User._id;
        this.props.mutate({ variables: { userId: username_id }})
            .then(room => {
                let { data: { createRoom: { _id }}} = room;
                let room_id = _id;
                this.props.history.push('/' + username_id + '/' + room_id);
            })
            .catch(err => {
                this.setState({ error: true });
            });

    }

    componentDidMount() {
        window.setTimeout(this.generateRoom, 2000);
    }

    render() {
        let message = 'Generating room for you ' + this.props.User.username;
        return (
            <Box>
                { (this.state.error) ?
                    <Toast status='critical' onClose={(_) => _ }>Error generating room</Toast> :
                    null
                }
                <Loading message={message}/>;
            </Box>
        );
    }
}

Generating.propTypes = {
    history: PropTypes.object.isRequired,
    User: PropTypes.object.isRequired,
    mutate: PropTypes.func.isRequired
};

const UserQuery = gql`query UserQuery($id: ID!) {
    User(id: $id) {
        _id
        username
    }
}`;

const CreateRoomQuery = gql`mutation CreateRoom($userId: ID!) {
    createRoom(userId: $userId) {
            _id
            name
    }
}`;

const GQLGenerating = compose(
    graphql(UserQuery, {
        props: ({ownProps, data: {loading, User}}) => ({loading, User}),
        options: (props) => ({variables: {id: props.match.params.username_id}}) }),
    graphql(CreateRoomQuery)
)(GQLWrapper(Generating));

export { GQLGenerating as Generating };
