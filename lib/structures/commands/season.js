'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _profile = require('../../modules/profile');

var _profile2 = _interopRequireDefault(_profile);

var _guild = require('../../modules/guild');

var _guild2 = _interopRequireDefault(_guild);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collectors = new Map();

exports.default = async function (tokens, message) {

    if (tokens.length < 2) return message.channel.send('', {
        embed: {
            title: 'Help: Season',
            description: 'To use this command, please supply a season and a BattleTag\nFor example, `leah season 11 user-1234`',
            color: 0xFF33A2
        }
    });

    var season = tokens.shift();
    var battleTag = tokens.shift().replace('#', '-');
    var region = await getRegion(tokens.shift(), message);

    var leaderboards = await _profile2.default.getSeason(region, season);
    if (!leaderboards) return message.channel.send('', { embed: { title: 'Unable to find seasonal leaderboards for season ' + season, color: 0xFF33A2 } });
    message.channel.send('', { embed: buildLeaderboards(message, leaderboards) });

    var choice = await collector(message);
    if (!leaderboards[choice - 1]) return message.channel.send({ embed: { title: 'Request cancelled', color: 0xFF33A2 } });

    var leaderboard = await _profile2.default.getSeasonLeaderboard(region, season, leaderboards[choice - 1]);
    var rank = void 0;
    leaderboard.row.forEach(function (player) {
        !rank && player.data.forEach(function (metadata) {
            if (metadata.string && metadata.string.toLowerCase().replace('#', '-') === battleTag.toLowerCase()) rank = player.data;
        });
    });
    if (!rank) return message.channel.send('', { embed: { title: 'Your rank is not within top 1,000 of this leaderboard', color: 0xFF33A2 } });

    var embed = { color: 0xFF33A2 };
    var fields = [];
    rank.forEach(function (metadata) {
        if (metadata.id === 'Rank') fields.push({ name: metadata.id, value: metadata.number, inline: true });
        if (metadata.id === 'AchievementPoints') fields.push({ name: 'Achievement Points', value: metadata.number, inline: true });
        if (metadata.id === 'RiftLevel') fields.push({ name: 'Rift Time', value: metadata.number, inline: true });
        if (metadata.id === 'RiftTime') fields.push({ name: 'Rift Time', value: (0, _moment2.default)(metadata.timestamp).format('mm:ss'), inline: true });
    });
    embed.fields = fields;
    message.channel.send('', { embed: embed });
};

function buildLeaderboards(message, leaderboards) {
    var user = message.author;
    var avatar = user.avatar ? user.avatar.startsWith('a_') ? '\u200Bhttps://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.gif' : '\u200Bhttps://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.webp' : user.defaultAvatarURL;
    avatar = avatar.replace(/[^a-zA-Z0-9_\-./:]/, '');
    avatar += '?size=1024';

    var fields = [];
    leaderboards.forEach(function (leaderboard, index) {
        fields.push({ name: index + 1 + '.', value: leaderboard, inline: true });
    });

    var embed = {};
    embed.author = { name: user.username + '#' + user.discriminator, icon_url: avatar };
    embed.color = 0xFF33A2;
    embed.description = 'Enter a number or any other key to cancel:';
    if (fields.length) embed.fields = fields;

    return embed;
}

async function collector(message) {
    return new Promise(async function (resolve) {
        var collector = message.channel.createMessageCollector(function (m) {
            if (m.author === message.author) return m;
        }, { time: 60000 });

        if (!message.member) message.member = message.author;
        collectors.set(message.member.id, { collector: collector });

        collector.on('collect', function (element, collector) {
            collector.stop();
        });

        collector.on('end', function (collected) {
            collectors.delete(message.member.id);
            if (!collected.size) {
                return resolve();
            }
            var content = collected.first().content;
            resolve(content);
        });
    });
}

async function getRegion(region, message) {
    if (region && ['US', 'TW', 'KR', 'EU'].includes(region.toUpperCase())) return region;
    var id = message.guild ? message.guild.id : message.channel.id;
    var guild = await _guild2.default.getGuildWithId(id);
    region = guild && guild.region ? guild.region : 'US';
    return region;
}