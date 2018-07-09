'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _redis = require('./redis');

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, null, [{
        key: 'getVersion',
        value: async function getVersion() {
            var cacheVersion = await _redis2.default.getAsync('leah-version');
            if (cacheVersion) return JSON.parse(cacheVersion);
            var results = await (0, _requestPromise2.default)({ uri: 'https://www.d3planner.com/api/versions.php', gzip: true, json: true }).catch(function () {
                console.error('failed to load versions');
            });
            if (!results) return;
            if (!results.versions) return;
            var version = Object.keys(results.versions)[Object.keys(results.versions).length - 1];
            await _redis2.default.set('leah-version', JSON.stringify(version), 'EX', 86400);
            return version;
        }
    }]);

    return _class;
}();

exports.default = _class;