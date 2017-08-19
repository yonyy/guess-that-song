const React = require('react');
const PropTypes = require('prop-types');
const { Heading, Box, Icons } = require('grommet');

class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box full='vertical' direction='column'>
                <Box direction='column' pad='large'>
                    <Box direction='column' pad='large'>
                        <Box direction='column' pad='large'>
                            <Box direction='column' pad='large'>
                                <Box direction='column' pad='large'>
                                    <Box justify='center' align='center' pad='medium'>
                                        <Box justify='center' align='center' flex='grow'>
                                            <Heading align='center'>{ this.props.message }</Heading>
                                            <Icons.Spinning size='xlarge'/>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

Loading.propTypes = {
    message: PropTypes.string.isRequired
};

export { Loading };
