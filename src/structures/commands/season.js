import Profile from '../../modules/profile';
import Guild from '../../modules/guild';
import moment from 'moment';

let collectors = new Map();

export default async(tokens, message) => {

    if (tokens.length < 2) return message.channel.send('', {
        embed: {
            title: 'Help: Season',
            description: 'To use this command, please supply a season and a BattleTag\nFor example, `leah season 11 user-1234`',
            color: 0xFF33A2
        }
    });

    let season = tokens.shift();
    let battleTag = tokens.shift().replace('#', '-');

    let id = (message.guild) ? message.guild.id : message.channel.id;
    let guild = await Guild.getGuildWithId(id);
    let region = (guild) ? guild.region : 'US';

    let leaderboards = await Profile.getSeason(region, season);
    if (!leaderboards) return message.channel.send('', { embed: { title: `Unable to find seasonal leaderboards for season ${season}`, color: 0xFF33A2 } });
    message.channel.send('', { embed: buildLeaderboards(message, leaderboards) });

    let choice = await collector(message);
    if (!leaderboards[choice - 1]) return message.channel.send({ embed: { title: 'Request cancelled', color: 0xFF33A2 } });

    let leaderboard = await Profile.getSeasonLeaderboard(region, season, leaderboards[choice - 1]);
    let rank;
    leaderboard.row.forEach((player) => {
        !rank && player.data.forEach((metadata) => {
            if (metadata.string && metadata.string.toLowerCase().replace('#', '-') === battleTag.toLowerCase()) rank = player.data;
        });
    });
    if (!rank) return message.channel.send('', { embed: { title: 'Your rank is not within top 1,000 of this leaderboard', color: 0xFF33A2 } });

    let embed = { color: 0xFF33A2 };
    let fields = [];
    rank.forEach((metadata) => {
        if (metadata.id === 'Rank') fields.push({ name: metadata.id, value: metadata.number, inline: true });
        if (metadata.id === 'AchievementPoints') fields.push({ name: 'Achievement Points', value: metadata.number, inline: true });
        if (metadata.id === 'RiftLevel') fields.push({ name: 'Rift Time', value: metadata.number, inline: true });
        if (metadata.id === 'RiftTime') fields.push({ name: 'Rift Time', value: moment(metadata.timestamp).format('mm:ss'), inline: true });
    });
    embed.fields = fields;
    message.channel.send('', { embed: embed });
};

function buildLeaderboards(message, leaderboards) {
    let user = message.author;
    let avatar = user.avatar ? (user.avatar.startsWith('a_') ? `​https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif` : `​https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`) : user.defaultAvatarURL;
    avatar = avatar.replace(/[^a-zA-Z0-9_\-./:]/, '');
    avatar += '?size=1024';

    let fields = [];
    leaderboards.forEach((leaderboard, index) => {
        fields.push({ name: `${index+1}.`, value: leaderboard, inline: true });
    });

    let embed = {};
    embed.author = { name: `${user.username}#${user.discriminator}`, icon_url: avatar };
    embed.color = 0xFF33A2;
    embed.description = 'Enter a number or any other key to cancel:';
    if (fields.length) embed.fields = fields;

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