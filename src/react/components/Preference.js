const React = require('react');
const _ = require('lodash');
const PropTypes = require('prop-types');
const { Box, Heading, Button, MusicIcon} = require('grommet');
const { Link } = require('react-router-dom');

class Preference extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const types = ['70\'s', '80\'s', '90\'s', '00\'s', 'Rock', 'Rap', 'Pop', 'Lucky'];
        const types_chunks = _.chunk(types, Math.ceil(types.length / 2));
        const types_buttons = types_chunks.map((chunk) => {
            return chunk.map((type, index) => {
                return (
                    <Box key={index} margin='small'>
                        <Link to={this.props.location.pathname + '/' + type}>
                            <Button style={{width: 140}} fill key={index} icon={<MusicIcon/>}
                                label={type} onClick={() => {}}></Button>
                        </Link>
                    </Box>
                );
            });
        });

        return (
            <Box align='center' pad='large' direction='column' >
                <Box align='center' pad='large' direction='column'>
                    <Heading>What are you feeling?</Heading>
                </Box>
                <Box align='center' pad='small' direction='row'>
                    <Box align='center' direction='row'>{types_buttons[0]}</Box>
                </Box>
                <Box align='center' pad='small' direction='row'>
                    <Box align='center' direction='row'>{types_buttons[1]}</Box>
                </Box>
            </Box>
        );
    }
}

Preference.propTypes = {
    location: PropTypes.object.isRequired
};

export { Preference };
