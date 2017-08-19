const React = require('react');
const { render } = require('react-dom');
const { ApolloClient, ApolloProvider } = require('react-apollo');
const { BrowserRouter, Route, Switch, Redirect } = require('react-router-dom');
const { Home } = require('./components/Home');
const { Generating } = require('./components/Generating');
const { Room } = require('./components/Room');
const { Preference } = require('./components/Preference');
const { App, Article, Box } = require('grommet');
const client = new ApolloClient();

render(
    <ApolloProvider client={client}>
        <BrowserRouter basename='/home/'>
            <App centered={false}>
                <Article>
                    <Box full colorIndex='grey-1'>
                        <Switch>
                            <Route exact path='/' component={Home}/>
                            <Route exact path='/:username_id' component={Generating}/>
                            <Route exact path='/:username_id/:room_id' component={Preference}/>
                            <Route exact path='/:username_id/:room_id/:type' component={Room}/>
                            <Redirect from='*' to='/'/>
                        </Switch>
                    </Box>
                </Article>
            </App>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
);
