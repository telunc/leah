import Set from '../../modules/set';

export default async(tokens, message) => {
    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Set',
            description: 'To use this command, please supply an item set name\nFor example, `leah set Bones of Rathma`',
            color: 0x33FF3D
        }
    });
    let name = tokens.join(' ');
    let set = await Set.getSetWithName(name);
    if (!set) message.reply('', { embed: { title: 'No Result Found' } });

    let fields = [];
    if (set[2]) fields.push({ name: '2 pieces', value: set[2].toString() });
    if (set[3]) fields.push({ name: '3 pieces', value: set[3].toString() });
    if (set[4]) fields.push({ name: '4 pieces', value: set[4].toString() });
    if (set[5]) fields.push({ name: '5 pieces', value: set[5].toString() });
    if (set[6]) fields.push({ name: '6 pieces', value: set[6].toString() });

    let embed = {};
    embed.title = set.name;
    embed.fields = fields;
    embed.color = 0x33FF3D;

    message.channel.send('', {
        embed: embed
    });

};