import Guild from '../../modules/guild';

export default async(tokens, message) => {

    let prefix = tokens.shift();
    if (!prefix) return message.channel.send('', {
        embed: {
            title: 'Help: Prefix',
            description: 'To use this command, please supply a new prefix\nFor example, `leah prefix ?`',
            color: 0x33A2FF
        }
    });

    let isAdmin = (message.member) ? message.member.hasPermission('ADMINISTRATOR') : true;
    if (!isAdmin) return message.channel.send('', { embed: { color: 0x33A2FF, title: 'This command is for administrators only' } });

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