const React = require('react');
const PropTypes = require('prop-types');
const { Box, Button, MusicIcon, Animate, UserIcon,
    FormField, TextInput, Form, Footer } = require('grommet');
const { gql, graphql } = require('react-apollo');
const { findDOMNode } = require('react-dom');

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.createUser = this.createUser.bind(this);
        this.state = {input_username: false};
    }

    toggle() {
        this.setState({input_username: !this.state.input_username});
    }

    createUser() {
        var username = findDOMNode(this.usernameNode).value;
        this.props.mutate({
            variables: { username }
        }).then( ({data: { createUser }}) => {
            var _id = createUser._id;
            this.props.history.push('/' + _id);
        }).catch(e => {
            throw e;
        });
    }

    render() {
        return (
            <Box>
                <Animate visible={this.state.input_username === false}
                    enter={{'animation': 'slide-left', 'duration': 700, 'delay': 0}}
                    leave={{'animation': 'slide-right', 'duration': 700, 'delay': 0}}>
                    <Box full colorIndex='grey-1' justify='center' align='center'>
                        <Box margin='medium'>
                            <Button icon={<MusicIcon/>} label='Begin' onClick={() => this.toggle() } />
                        </Box>
                    </Box>
                </Animate>
                <Animate visible={this.state.input_username === true}
                    enter={{'animation': 'slide-left', 'duration': 700, 'delay': 0}}
                    leave={{'animation': 'slide-right', 'duration': 700, 'delay': 0}}>
                    <Box full colorIndex='grey-1' justify='center' align='center'>
                        <Box margin='medium'>
                            <Form>
                                <FormField>
                                    <TextInput id='item1' name='username' defaultValue='Username'
                                        ref={(node) => this.usernameNode = node}/>
                                </FormField>
                                <Footer pad={{'vertical': 'medium'}}>
                                    <Button icon={<UserIcon/>} label='Join' onClick={() => this.createUser() }/>
                                </Footer>
                            </Form>
                        </Box>
                    </Box>
                </Animate>
            </Box>
        );
    }
}

Home.propTypes = {
    mutate: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

const CreateUserQuery = gql`mutation CreateUser($username: String!) {
    createUser(username: $username) {
        _id
    }
}`;
const GQLHome = graphql(CreateUserQuery)(Home);

export { GQLHome as Home };
