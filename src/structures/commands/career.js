import Profile from '../../modules/profile';
import Guild from '../../modules/guild';

export default async(tokens, message) => {

    if (!tokens.length) return;

    let battleTag = tokens.shift();
    let id = (message.guild) ? message.guild.id : message.channel.id;
    let guild = await Guild.getGuildWithId(id);
    let region = (guild) ? guild.region : 'US';

    let career = await Profile.getCareer(region, battleTag);
    if (!career || career.code) return message.reply('No Result Found');

    let description = '';
    if (career.guildName) description += `Guild: ${career.guildName}\n`;
    if (career.paragonLevel && career.paragonLevel !== 0) description += `Paragon Level: ${career.paragonLevel}\n`;
    if (career.paragonLevelHardcore && career.paragonLevelHardcore !== 0) description += `Paragon Level Hardcore: ${career.paragonLevelHardcore}\n`;
    if (career.paragonLevelSeason && career.paragonLevelSeason !== 0) description += `Paragon Level Season: ${career.paragonLevelSeason}\n`;
    if (career.paragonLevelSeasonHardcore && career.paragonLevelSeasonHardcore !== 0) description += `Paragon Level Season Hardcore: ${career.paragonLevelSeasonHardcore}\n`;
    if (career.kills && career.kills.monsters !== 0) description += `Monster kills: ${career.kills.monsters}\n`;
    if (career.kills && career.kills.elites !== 0) description += `Elite kills: ${career.kills.elites}\n`;
    if (career.kills && career.kills.hardcoreMonsters !== 0) description += `Hardcore Monster kills: ${career.kills.hardcoreMonsters}\n`;

    let fields = [];
    career.heroes.forEach((hero) => {
        let value = '';
        if (hero.seasonal) value += 'Seasonal\n';
        if (hero.hardcore) value += 'Hardcore\n';
        value += `Gender: ${(hero.gender) ? 'Female' : 'Male'}\n`;
        value += `Class: ${capitalizeFirstLetter(hero.class)}`;

        fields.push({
            name: `${hero.name} (${(hero.level < 70) ? hero.level : hero.paragonLevel})`,
            value: value,
            inline: true
        });
    });

    let embed = { title: career.battleTag.replace('#', '-') };
    embed.color = 0xFF33A2;
    embed.description = description;
    if (fields.length) embed.fields = fields;
    embed.thumbnail = { url: 'https://i.pinimg.com/originals/1d/ae/1a/1dae1ad263fbac22a9296014871cb980.png' };

    message.channel.send('', {
        embed: embed
    });

};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}