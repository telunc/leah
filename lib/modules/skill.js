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
        key: 'getSkills',
        value: async function getSkills() {
            var cacheSkills = await _redis2.default.getAsync('leah-skills');
            if (cacheSkills) return JSON.parse(cacheSkills);
            var build = await _version2.default.getVersion().catch(function () {
                console.error('failed to load version');
            });
            var results = await (0, _requestPromise2.default)({ uri: 'http://d3planner.com/api/' + build + '/powers', gzip: true, json: true }).catch(function () {
                console.error('failed to load skills');
            });
            if (!results) return;
            var skills = Object.keys(results).map(function (skill) {
                results[skill].id = skill;
                return results[skill];
            });
            await _redis2.default.set('leah-skills', JSON.stringify(skills), 'EX', 86400);
            return skills;
        }
    }, {
        key: 'getSkillWithName',
        value: async function getSkillWithName(name) {
            var skills = await this.getSkills();
            if (!skills) return;
            skills.forEach(function (skill) {
                if (name && skill.name) {
                    skill.similarity = (0, _stringSimilarity.compareTwoStrings)(name, skill.name);
                } else {
                    skill.similarity = 0;
                }
            });
            skills.sort(function (a, b) {
                return b.similarity - a.similarity;
            });
            return skills[0];
        }
    }]);

    return _class;
}();

exports.default = _class;