'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _guild = require('../guild');

var _guild2 = _interopRequireDefault(_guild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = _socket2.default.connect('http://localhost');

exports.default = function (client) {

    socket.on('news', async function (posts) {

        var guilds = await _guild2.default.getGuilds();
        guilds.forEach(function (guild) {
            var channel = client.channels.get(guild.sub_id);
            if (!channel) return;
            posts.forEach(function (post) {
                channel.send('', { embed: { color: 0x33A2FF, title: post.title, description: post.description, thumbnail: { url: post.image }, url: post.uri } });
            });
        });
    });
};