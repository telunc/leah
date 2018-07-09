'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _prefix2 = require('./commands/prefix');

var _prefix3 = _interopRequireDefault(_prefix2);

var _about2 = require('./commands/about');

var _about3 = _interopRequireDefault(_about2);

var _help2 = require('./commands/help');

var _help3 = _interopRequireDefault(_help2);

var _reset2 = require('./commands/reset');

var _reset3 = _interopRequireDefault(_reset2);

var _ping2 = require('./commands/ping');

var _ping3 = _interopRequireDefault(_ping2);

var _news2 = require('./commands/news');

var _news3 = _interopRequireDefault(_news2);

var _sub2 = require('./commands/sub');

var _sub3 = _interopRequireDefault(_sub2);

var _item2 = require('./commands/item');

var _item3 = _interopRequireDefault(_item2);

var _career2 = require('./commands/career');

var _career3 = _interopRequireDefault(_career2);

var _hero2 = require('./commands/hero');

var _hero3 = _interopRequireDefault(_hero2);

var _config2 = require('./commands/config');

var _config3 = _interopRequireDefault(_config2);

var _era2 = require('./commands/era');

var _era3 = _interopRequireDefault(_era2);

var _season2 = require('./commands/season');

var _season3 = _interopRequireDefault(_season2);

var _weekly2 = require('./commands/weekly');

var _weekly3 = _interopRequireDefault(_weekly2);

var _set2 = require('./commands/set');

var _set3 = _interopRequireDefault(_set2);

var _skill2 = require('./commands/skill');

var _skill3 = _interopRequireDefault(_skill2);

var _cost2 = require('./commands/cost');

var _cost3 = _interopRequireDefault(_cost2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    'prefix': function prefix(tokens, message) {
        return (0, _prefix3.default)(tokens, message);
    },
    'about': function about(tokens, message, client) {
        return (0, _about3.default)(message, client);
    },
    'help': function help(tokens, message) {
        return (0, _help3.default)(message);
    },
    'reset': function reset(tokens, message) {
        return (0, _reset3.default)(message);
    },
    'ping': function ping(tokens, message) {
        return (0, _ping3.default)(message);
    },
    'news': function news(tokens, message) {
        return (0, _news3.default)(tokens, message);
    },
    'sub': function sub(tokens, message) {
        return (0, _sub3.default)(message);
    },
    'item': function item(tokens, message) {
        return (0, _item3.default)(tokens, message);
    },
    'career': function career(tokens, message) {
        return (0, _career3.default)(tokens, message);
    },
    'hero': function hero(tokens, message) {
        return (0, _hero3.default)(tokens, message);
    },
    'config': function config(tokens, message) {
        return (0, _config3.default)(message);
    },
    'era': function era(tokens, message) {
        return (0, _era3.default)(tokens, message);
    },
    'season': function season(tokens, message) {
        return (0, _season3.default)(tokens, message);
    },
    'weekly': function weekly(tokens, message) {
        return (0, _weekly3.default)(message);
    },
    'set': function set(tokens, message) {
        return (0, _set3.default)(tokens, message);
    },
    'skill': function skill(tokens, message) {
        return (0, _skill3.default)(tokens, message);
    },
    'cost': function cost(tokens, message) {
        return (0, _cost3.default)(tokens, message);
    }

};