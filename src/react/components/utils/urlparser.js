const _ = require('lodash');
const urlparser = {};

urlparser.parse = function (url, params) {
    let url_2 = url.replace(/^https?\:\/\//i, '');
    let values = _.split(url_2, '/');
    let base_index = 0;
    let res = _.reduce(params, (acc, param, index) => {
        let obj = {};
        if (base_index === values.length) {
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
