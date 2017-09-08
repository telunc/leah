import Guild from '../../modules/guild';

let collectors = new Map();
let regions = [
    { short: 'US', name: 'United States' },
    { short: 'EU', name: 'Europe' },
    { short: 'KR', name: 'Korea' },
    { short: 'TW', name: 'Taiwan' }
];

export default async(message) => {

    let isAdmin = (message.member) ? message.member.hasPermission('ADMINISTRATOR') : true;
    if (!isAdmin) return message.channel.send('', { embed: { color: 0x33A2FF, title: 'This command is for administrators only' } });


    message.channel.send('', { embed: buildEmbed(message) });
    let choice = await collector(message);
    if (!regions[choice - 1]) return message.channel.send({ embed: { title: 'Request cancelled', color: 0x33A2FF } });

    let id = (message.guild) ? message.guild.id : message.channel.id;
    let result = await Guild.getGuildWithId(id);

    if (result) {
        result = result.toJSON();
        result.region = regions[choice - 1].short;
        await Guild.updateGuild(id, result);
    } else {
        result = { id: id, region: regions[choice - 1].short };
        await Guild.setGuild(result);
    }

    message.channel.send('', { embed: { color: 0x33A2FF, title: `Battle.net region has been set to ${regions[choice-1].short}` } });

};

function buildEmbed(message) {
    let user = message.author;
    let avatar = user.avatar ? (user.avatar.startsWith('a_') ? `​https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif` : `​https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`) : user.defaultAvatarURL;
    avatar = avatar.replace(/[^a-zA-Z0-9_\-./:]/, '');
    avatar += '?size=1024';

    let embed = {};
    embed.author = { name: `${user.username}#${user.discriminator}`, icon_url: avatar };
    embed.color = 0x33A2FF;
    embed.description = 'Enter a number or any other key to cancel:';

    let fields = [];
    regions.forEach((region, index) => {
        fields.push({ name: `${index+1}. ${regions[index].short}`, value: regions[index].name, inline: true });
    });

    embed.fields = fields;

    return embed;
}

async function collector(message) {
    return new Promise(async(resolve) => {
        let collector = message.channel.createMessageCollector((m) => { if (m.author === message.author) return m; }, { time: 60000 });

        if (!message.member) message.member = message.author;
        collectors.set(message.member.id, { collector: collector });

        collector.on('collect', (element, collector) => {
            collector.stop();
        });

        collector.on('end', (collected) => {
            collectors.delete(message.member.id);
            if (!collected.size) {
                return resolve();
            }
            let content = collected.first().content;
            resolve(content);
        });
    });
}