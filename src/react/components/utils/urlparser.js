const _ = require('lodash');
const urlparser = {};

/* Given url such as https://api.spotify.com/v1/users/demo12345678966/playlists/6tJIypMW5q6VD3bB5VMNvo/ and
 * params [{key: 'owner_id', index: 3}, {key: 'playlist_id', index: 5}], this function will return an object
 * {owner_id: demo12345678966, playlist_id: 6tJIypMW5q6VD3bB5VMNvo} with the domain as the zero index
 */

urlparser.parse = function (url, params) {
    let url_2 = url.replace(/^https?\:\/\//, '');
    let values = _.split(url_2, '/');
    let base_index = 0;
    let res = _.reduce(params, (acc, param, index) => {
        let obj = {};
        if ((param.index && param.index >= values.length) || base_index >= values.length) {
            obj[param.key] = null;
        } else {
            var loc = (param.index) ? param.index : base_index++;
            obj = _.reduce(values, (acc_2, value, index_2) => {
                if (acc_2) { return acc_2; }

                let obj = {};
                if (index_2 === loc) {
                    obj[param.key] = value;
                    return Object.assign(obj, acc_2);
                }
                return null;
            }, null);
        }
        return Object.assign(obj, acc);
    }, {});

    return res;
};

module.exports = urlparser;
