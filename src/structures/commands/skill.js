import Skill from '../../modules/skill';

export default async(tokens, message) => {
    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Skill',
            description: 'To use this command, please supply a skill name\nFor example, `leah skill Final Service`',
            color: 0xFF9433
        }
    });
    let name = tokens.join(' ');
    let skill = await Skill.getSkillWithName(name);
    if (!skill) message.reply('', { embed: { title: 'No Result Found' } });

    let fields = [];
    if (skill.rune_a && skill.rune_a.length === 2) fields.push({ name: skill.rune_a[0], value: skill.rune_a[1] });
    if (skill.rune_b && skill.rune_b.length === 2) fields.push({ name: skill.rune_b[0], value: skill.rune_b[1] });
    if (skill.rune_c && skill.rune_c.length === 2) fields.push({ name: skill.rune_c[0], value: skill.rune_c[1] });
    if (skill.rune_d && skill.rune_d.length === 2) fields.push({ name: skill.rune_d[0], value: skill.rune_d[1] });
    if (skill.rune_e && skill.rune_e.length === 2) fields.push({ name: skill.rune_e[0], value: skill.rune_e[1] });

    let embed = {};
    embed.title = skill.name;
    embed.description = skill.desc;
    embed.fields = fields;
    embed.color = 0xFF9433;
    embed.thumbnail = { url: `http://media.blizzard.com/d3/icons/skills/64/${skill.id.toLowerCase()}.png` };

    message.channel.send('', {
        embed: embed
    });

};