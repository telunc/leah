'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _profile = require('../../modules/profile');

var _profile2 = _interopRequireDefault(_profile);

var _guild = require('../../modules/guild');

var _guild2 = _interopRequireDefault(_guild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (tokens, message) {

    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Career',
            description: 'To use this command, please supply a BattleTag\nFor example, `leah career user-1234`\n\nYou may also put a region code to specify your battle.net region.\nFor example, `leah career user-1234 US`',
            color: 0xFF33A2
        }
    });

    var battleTag = tokens.shift().replace('#', '-');
    var region = await getRegion(tokens.shift(), message);

    var career = await _profile2.default.getCareer(region, battleTag);
    if (!career || career.code) return message.reply('No Result Found');

    var description = '';
    if (career.guildName) description += 'Guild: ' + career.guildName + '\n';
    if (career.paragonLevel && career.paragonLevel !== 0) description += 'Paragon Level: ' + career.paragonLevel + '\n';
    if (career.paragonLevelHardcore && career.paragonLevelHardcore !== 0) description += 'Paragon Level Hardcore: ' + career.paragonLevelHardcore + '\n';
    if (career.paragonLevelSeason && career.paragonLevelSeason !== 0) description += 'Paragon Level Season: ' + career.paragonLevelSeason + '\n';
    if (career.paragonLevelSeasonHardcore && career.paragonLevelSeasonHardcore !== 0) description += 'Paragon Level Season Hardcore: ' + career.paragonLevelSeasonHardcore + '\n';
    if (career.kills && career.kills.monsters !== 0) description += 'Monster kills: ' + career.kills.monsters + '\n';
    if (career.kills && career.kills.elites !== 0) description += 'Elite kills: ' + career.kills.elites + '\n';
    if (career.kills && career.kills.hardcoreMonsters !== 0) description += 'Hardcore Monster kills: ' + career.kills.hardcoreMonsters + '\n';

    var fields = [];
    career.heroes.forEach(function (hero) {
        var value = '';
        if (hero.seasonal) value += 'Seasonal\n';
        if (hero.hardcore) value += 'Hardcore\n';
        value += 'Gender: ' + (hero.gender ? 'Female' : 'Male') + '\n';
        value += 'Class: ' + capitalizeFirstLetter(hero.class);

        fields.push({
            name: hero.name + ' (' + (hero.level < 70 ? hero.level : hero.paragonLevel) + ')',
            value: value,
            inline: true
        });
    });

    var embed = { title: career.battleTag.replace('#', '-') };
    embed.color = 0xFF33A2;
    embed.description = description;
    if (fields.length) embed.fields = fields;
    embed.thumbnail = { url: 'https://i.pinimg.com/originals/1d/ae/1a/1dae1ad263fbac22a9296014871cb980.png' };

    message.channel.send('', {
        embed: embed
    });
};

async function getRegion(region, message) {
    if (region && ['US', 'TW', 'KR', 'EU'].includes(region.toUpperCase())) return region;
    var id = message.guild ? message.guild.id : message.channel.id;
    var guild = await _guild2.default.getGuildWithId(id);
    region = guild && guild.region ? guild.region : 'US';
    return region;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}