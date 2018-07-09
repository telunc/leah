'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _skill = require('../../modules/skill');

var _skill2 = _interopRequireDefault(_skill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (tokens, message) {
    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Skill',
            description: 'To use this command, please supply a skill name\nFor example, `leah skill Final Service`',
            color: 0xFF9433
        }
    });
    var name = tokens.join(' ');
    var skill = await _skill2.default.getSkillWithName(name);
    if (!skill) message.reply('', { embed: { title: 'No Result Found' } });

    var fields = [];
    if (skill.rune_a && skill.rune_a.length === 2) fields.push({ name: skill.rune_a[0], value: skill.rune_a[1] });
    if (skill.rune_b && skill.rune_b.length === 2) fields.push({ name: skill.rune_b[0], value: skill.rune_b[1] });
    if (skill.rune_c && skill.rune_c.length === 2) fields.push({ name: skill.rune_c[0], value: skill.rune_c[1] });
    if (skill.rune_d && skill.rune_d.length === 2) fields.push({ name: skill.rune_d[0], value: skill.rune_d[1] });
    if (skill.rune_e && skill.rune_e.length === 2) fields.push({ name: skill.rune_e[0], value: skill.rune_e[1] });

    var embed = {};
    embed.title = skill.name;
    embed.description = skill.desc;
    embed.fields = fields;
    embed.color = 0xFF9433;
    embed.thumbnail = { url: 'http://media.blizzard.com/d3/icons/skills/64/' + skill.id.toLowerCase() + '.png' };

    message.channel.send('', {
        embed: embed
    });
};