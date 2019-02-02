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

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var regex = /battle.net\/data\/d3\/([^/]*)\/([^/]*)\/leaderboard\/([^?]*)/;

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, null, [{
        key: 'getToken',
        value: async function getToken(region) {
            var cacheToken = await _redis2.default.getAsync('leah-' + region + '-token');
            if (cacheToken) return cacheToken;
            var result = await (0, _requestPromise2.default)({ uri: 'https://' + region + '.battle.net/oauth/token?grant_type=client_credentials', auth: { username: _config2.default.get('battle-net').key, password: _config2.default.get('battle-net').secret }, json: true }).catch(function (error) {
                console.error('failed to fetch access token', error);
            });
            if (!result) return;
            await _redis2.default.set('leah-' + region + '-token', result.access_token, 'EX', result.expires_in);
            return result.access_token;
        }
    }, {
        key: 'getEra',
        value: async function getEra(region, era) {
            var cacheEra = await _redis2.default.getAsync('leah-era-' + region + '-' + era);
            if (cacheEra) return JSON.parse(cacheEra);
            var token = await this.getToken(region);
            if (!token) return;
            var result = await (0, _requestPromise2.default)({ uri: 'https://' + region + '.api.blizzard.com/data/d3/era/' + era + '/', headers: { Authorization: 'Bearer ' + token }, json: true }).catch(function () {
                // console.error('failed to fetch era index');
            });
            if (!result) return;
            var leaderboards = buildLeaderboard(result);
            await _redis2.default.set('leah-era-' + region + '-' + era, JSON.stringify(leaderboards), 'EX', 86400);
            return leaderboards;
        }
    }, {
        key: 'getEraLeaderboard',
        value: async function getEraLeaderboard(region, era, leaderboard) {
            var cacheLeaderboard = await _redis2.default.getAsync('leah-era-' + region + '-' + leaderboard);
            if (cacheLeaderboard) return JSON.parse(cacheLeaderboard);
            var token = await this.getToken(region);
            if (!token) return;
            var result = await (0, _requestPromise2.default)({ uri: 'https://' + region + '.api.battle.net/data/d3/era/' + era + '/leaderboard/' + leaderboard + '/', headers: { Authorization: 'Bearer ' + token }, json: true }).catch(function (error) {
                console.error('failed to fetch era leaderboard', error);
            });
            if (!result) return;
            await _redis2.default.set('leah-era-' + region + '-' + leaderboard, JSON.stringify(result), 'EX', 86400);
            return result;
        }
    }, {
        key: 'getSeason',
        value: async function getSeason(region, season) {
            var cacheSeason = await _redis2.default.getAsync('leah-season-' + region + '-' + season);
            if (cacheSeason) return JSON.parse(cacheSeason);
            var token = await this.getToken(region);
            if (!token) return;
            var result = await (0, _requestPromise2.default)({ uri: 'https://' + region + '.api.blizzard.com/data/d3/season/' + season + '/', headers: { Authorization: 'Bearer ' + token }, json: true }).catch(function () {
                // console.error('failed to fetch season index');
            });
            if (!result) return;
            var leaderboards = buildLeaderboard(result);
            await _redis2.default.set('leah-season-' + region + '-' + season, JSON.stringify(leaderboards), 'EX', 86400);
            return leaderboards;
        }
    }, {
        key: 'getSeasonLeaderboard',
        value: async function getSeasonLeaderboard(region, season, leaderboard) {
            var cacheLeaderboard = await _redis2.default.getAsync('leah-season-' + region + '-' + leaderboard);
            if (cacheLeaderboard) return JSON.parse(cacheLeaderboard);
            var token = await this.getToken(region);
            if (!token) return;
            var result = await (0, _requestPromise2.default)({ uri: 'https://' + region + '.api.blizzard.com/data/d3/season/' + season + '/leaderboard/' + leaderboard + '/', headers: { Authorization: 'Bearer ' + token }, json: true }).catch(function (error) {
                console.error('failed to fetch season leaderboard', error);
            });
            if (!result) return;
            await _redis2.default.set('leah-season-' + region + '-' + leaderboard, JSON.stringify(result), 'EX', 86400);
            return result;
        }
    }, {
        key: 'getCareer',
        value: async function getCareer(region, battleTag) {
            var cacheCareer = await _redis2.default.getAsync('leah-career-' + region + '-' + battleTag);
            if (cacheCareer) return JSON.parse(cacheCareer);
            var token = await this.getToken(region);
            var career = await (0, _requestPromise2.default)({ uri: 'https://' + region + '.api.blizzard.com/d3/profile/' + battleTag + '/', headers: { Authorization: 'Bearer ' + token }, json: true }).catch(function () {
                console.error('failed to fetch career with battleTag ' + battleTag);
            });
            // console.log(career);
            if (!career) return;
            await _redis2.default.set('leah-career-' + region + '-' + battleTag, JSON.stringify(career), 'EX', 86400);
            return career;
        }
    }, {
        key: 'getHero',
        value: async function getHero(region, battleTag, id) {
            var cacheHero = await _redis2.default.getAsync('leah-' + region + '-' + battleTag + '-' + id);
            if (cacheHero) return JSON.parse(cacheHero);
            var token = await this.getToken(region);
            var hero = await (0, _requestPromise2.default)({ uri: 'https://' + region + '.api.blizzard.com/d3/profile/' + battleTag + '/hero/' + id + '/', headers: { Authorization: 'Bearer ' + token }, json: true }).catch(function () {
                // console.error(`failed to fetch hero with id ${id}`);
            });
            if (!hero) return;
            await _redis2.default.set('leah-' + region + '-' + battleTag + '-' + id, JSON.stringify(hero), 'EX', 86400);
            return hero;
        }
    }]);

    return _class;
}();

exports.default = _class;


function buildLeaderboard(json) {
    var leaderboards = [];
    json.leaderboard.forEach(function (object) {
        var match = regex.exec(object.ladder.href);
        if (match) {
            var _match = _slicedToArray(match, 4),
                leaderboard = _match[3];

            if (!isNumeric(leaderboard)) leaderboards.push(leaderboard);
        }
    });
    return leaderboards;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}