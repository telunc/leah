'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _database = require('./database');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, null, [{
        key: 'getGuilds',
        value: async function getGuilds() {
            return _database.Guild.findAll().catch(function (error) {
                console.error(error);
            });
        }
    }, {
        key: 'getGuildWithId',
        value: async function getGuildWithId(id) {
            return _database.Guild.findOne({ where: { id: id } }).catch(function (error) {
                console.error(error);
            });
        }
    }, {
        key: 'setGuild',
        value: async function setGuild(post) {
            return _database.Guild.create(post);
        }
    }, {
        key: 'updateGuild',
        value: async function updateGuild(id, post) {
            var guild = await this.getGuildWithId(id);
            if (!guild) return;
            return guild.update(post);
        }
    }, {
        key: 'deleteGuild',
        value: async function deleteGuild(id) {
            return _database.Guild.destroy({ where: { id: id } }).catch(function (error) {
                console.error(error);
            });
        }
    }]);

    return _class;
}();

exports.default = _class;