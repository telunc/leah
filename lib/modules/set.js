'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _redis = require('./redis');

var _redis2 = _interopRequireDefault(_redis);

var _stringSimilarity = require('string-similarity');

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, null, [{
        key: 'getSets',
        value: async function getSets() {
            var cacheSet = await _redis2.default.getAsync('sets');
            if (cacheSet) return JSON.parse(cacheSet);
            var build = await _version2.default.getVersion().catch(function () {
                console.error('failed to load version');
            });
            var results = await (0, _requestPromise2.default)({ uri: 'http://d3planner.com/api/' + build + '/itemsets', gzip: true, json: true }).catch(function () {
                console.error('failed to load sets');
            });
            if (!results) return;
            var sets = Object.keys(results).map(function (set) {
                results[set].id = set;
                return results[set];
            });
            await _redis2.default.set('sets', JSON.stringify(sets), 'EX', 86400);
            return sets;
        }
    }, {
        key: 'getSetWithName',
        value: async function getSetWithName(name) {
            var sets = await this.getSets();
            if (!sets) return;
            sets.forEach(function (set) {
                if (name && set.name) {
                    set.similarity = (0, _stringSimilarity.compareTwoStrings)(name, set.name);
                } else {
                    set.similarity = 0;
                }
            });
            sets.sort(function (a, b) {
                return b.similarity - a.similarity;
            });
            return sets[0];
        }
    }]);

    return _class;
}();

exports.default = _class;