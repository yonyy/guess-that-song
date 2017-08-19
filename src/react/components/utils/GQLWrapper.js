const React = require('react');
const PropTypes = require('prop-types');
const { Loading } = require('./Loading');

function GQLWrapper(Component) {
    function GQLContext (props) {
        if (props.loading) {
            return <Loading message={'Loading'} />;
        }
        else {
            return <Component {...props} />;
        }
    }
    GQLContext.propTypes = { loading: PropTypes.bool.isRequired };
    return GQLContext;
}

export { GQLWrapper };
