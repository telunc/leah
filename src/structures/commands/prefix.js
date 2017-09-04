import Guild from '../../modules/guild';

export default async(tokens, message) => {

    let prefix = tokens.shift();
    if (!prefix) prefix = null;

    let id = (message.guild) ? message.guild.id : message.channel.id;
    let result = await Guild.getGuildWithId(id);

    if (result) {
        result = result.toJSON();
        result.prefix = prefix;
        await Guild.updateGuild(id, result);
    } else {
        result = { id: id, prefix: prefix };
        await Guild.setGuild(result);
    }

    if (!prefix) return message.channel.send('', { embed: { color: 0x33A2FF, title: 'Prefix has been reset' } });
    message.channel.send('', { embed: { color: 0x33A2FF, title: `Prefix has been set to ${prefix}` } });

};