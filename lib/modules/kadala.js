'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
        key: 'getKadala',
        value: async function getKadala() {
            var cache = await _redis2.default.getAsync('kadala');
            if (cache) return JSON.parse(cache);
            var build = await _version2.default.getVersion().catch(function () {
                console.error('failed to load version');
            });
            var script = await (0, _requestPromise2.default)({ uri: 'http://d3planner.com/api/' + build + '/kadala', gzip: true }).catch(function () {
                console.error('failed to load kadala items');
            });
            if (!script) return;
            script = 'var Kadala =' + script + 'module.exports = Kadala;';
            var kadala = eval(script);
            if (!kadala.Items) return;
            var items = Object.keys(kadala.Items).map(function (item) {
                kadala.Items[item].id = item;
                return kadala.Items[item];
            });
            await _redis2.default.set('kadala', JSON.stringify([items, kadala.ItemTypes, kadala.Types, kadala.Classes]), 'EX', 86400);
            return [items, kadala.ItemTypes, kadala.Types, kadala.Classes];
        }
    }, {
        key: 'getKadalaItemWithName',
        value: async function getKadalaItemWithName(name) {
            var _ref = await this.getKadala(),
                _ref2 = _slicedToArray(_ref, 1),
                items = _ref2[0];

            if (!items) return;
            items.forEach(function (item) {
                if (name && item.name) {
                    item.similarity = (0, _stringSimilarity.compareTwoStrings)(name, item.name);
                } else {
                    item.similarity = 0;
                }
            });
            items.sort(function (a, b) {
                return b.similarity - a.similarity;
            });
            return items[0];
        }
    }, {
        key: 'getKadalaCostWithItem',
        value: async function getKadalaCostWithItem(item, hero) {
            var _ref3 = await this.getKadala(),
                _ref4 = _slicedToArray(_ref3, 3),
                items = _ref4[0],
                types = _ref4[1],
                costs = _ref4[2];

            if (!items || !types || !costs) return;
            if (!types[item.type]) return;
            var type = types[item.type].kadala;
            var cost = costs[type].cost;
            var weight = item.weight;
            var shards = 0;
            var drops = 0;
            items.forEach(function (piece) {
                if (piece[hero] && types[piece.type] && types[piece.type].kadala === type) {
                    shards += piece.weight;
                }
                if (piece[hero] && piece.type === item.type) {
                    drops += piece.weight;
                }
            });
            return {
                average: 10 * shards * cost / weight,
                breaths: drops * 25 / weight,
                shards_chance: weight / shards * 10,
                drop_chance: weight / drops * 100
            };
        }
    }]);

    return _class;
}();

exports.default = _class;