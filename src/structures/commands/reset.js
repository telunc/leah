import Guild from '../../modules/guild';

export default async(message) => {
    let isAdmin = (message.member) ? message.member.hasPermission('ADMINISTRATOR') : true;
    if (!isAdmin) return message.channel.send('', { embed: { color: 0x33A2FF, title: 'This command is for administrators only' } });

    let id = (message.guild) ? message.guild.id : message.channel.id;
    await Guild.deleteGuild(id);
    
    return message.channel.send('', { embed: { color: 0x33A2FF, title: '**' + message.guild.name + '** has been reset!' } });
};