'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _guild = require('../../modules/guild');

var _guild2 = _interopRequireDefault(_guild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (message) {
    var isAdmin = message.member ? message.member.hasPermission('ADMINISTRATOR') : true;
    if (!isAdmin) return message.channel.send('', { embed: { color: 0x33A2FF, title: 'This command is for administrators only' } });

    var id = message.guild ? message.guild.id : message.channel.id;
    await _guild2.default.deleteGuild(id);

    return message.channel.send('', { embed: { color: 0x33A2FF, title: '**' + message.guild.name + '** has been reset!' } });
};