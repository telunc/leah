'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _guild = require('../../modules/guild');

var _guild2 = _interopRequireDefault(_guild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collectors = new Map();
var regions = [{ short: 'US', name: 'United States' }, { short: 'EU', name: 'Europe' }, { short: 'KR', name: 'Korea' }, { short: 'TW', name: 'Taiwan' }];

exports.default = async function (message) {

    message.channel.send('', { embed: buildEmbed(message) });
    var choice = await collector(message);
    if (!regions[choice - 1]) return message.channel.send({ embed: { title: 'Request cancelled', color: 0x33A2FF } });

    var id = message.guild ? message.guild.id : message.channel.id;
    var result = await _guild2.default.getGuildWithId(id);

    if (result) {
        result = result.toJSON();
        result.region = regions[choice - 1].short;
        await _guild2.default.updateGuild(id, result);
    } else {
        result = { id: id, region: regions[choice - 1].short };
        await _guild2.default.setGuild(result);
    }

    message.channel.send('', { embed: { color: 0x33A2FF, title: 'Battle.net region has been set to ' + regions[choice - 1].short } });
};

function buildEmbed(message) {
    var user = message.author;
    var avatar = user.avatar ? user.avatar.startsWith('a_') ? '\u200Bhttps://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.gif' : '\u200Bhttps://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.webp' : user.defaultAvatarURL;
    avatar = avatar.replace(/[^a-zA-Z0-9_\-./:]/, '');
    avatar += '?size=1024';

    var embed = {};
    embed.author = { name: user.username + '#' + user.discriminator, icon_url: avatar };
    embed.color = 0x33A2FF;
    embed.description = 'Enter a number or any other key to cancel:';

    var fields = [];
    regions.forEach(function (region, index) {
        fields.push({ name: index + 1 + '. ' + regions[index].short, value: regions[index].name, inline: true });
    });

    embed.fields = fields;

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