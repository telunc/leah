import Kadala from '../../modules/kadala';

export default async(tokens, message) => {

    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Cost',
            description: 'To use this command, please supply an item name\nFor example, `leah cost unity`',
            color: 0x7B33FF
        }
    });

    let name = tokens.join(' ');
    let item = await Kadala.getKadalaItemWithName(name);
    if (!item) message.reply('', { embed: { title: 'No Result Found' } });

    let fields = [];
    if (item.barbarian) {
        let barbarian = await buildField(item, 'barbarian');
        if (barbarian) fields.push(barbarian);
    }
    if (item.crusader) {
        let crusader = await buildField(item, 'crusader');
        if (crusader) fields.push(crusader);
    }
    if (item.demonhunter) {
        let demonhunter = await buildField(item, 'demonhunter');
        if (demonhunter) fields.push(demonhunter);
    }
    if (item.monk) {
        let monk = await buildField(item, 'monk');
        if (monk) fields.push(monk);
    }
    if (item.necromancer) {
        let necromancer = await buildField(item, 'necromancer');
        if (necromancer) fields.push(necromancer);
    }
    if (item.witchdoctor) {
        let witchdoctor = await buildField(item, 'witchdoctor');
        if (witchdoctor) fields.push(witchdoctor);
    }
    if (item.wizard) {
        let wizard = await buildField(item, 'wizard');
        if (wizard) fields.push(wizard);
    }

    let [, types] = await Kadala.getKadala();
    if (!types) return;

    let embed = {};
    embed.title = item.name;
    embed.description = `Legendary ${types[item.type].name}\nRequired Level: ${item.level}`;
    embed.color = 0x7B33FF;
    embed.fields = fields;

    message.channel.send('', { embed: embed });

};

async function buildField(item, hero) {
    let [, , , heroes] = await Kadala.getKadala();
    if (!heroes) return;
    let stats = await Kadala.getKadalaCostWithItem(item, hero);
    if (!stats) return;
    return {
        name: heroes[hero],
        value: `Bloodshard: ${numberWithCommas(Math.floor(stats.average))}\nKadala Chance: ${stats.shards_chance.toFixed(2)}%\nDeath's Breath: ${numberWithCommas(Math.floor(stats.breaths))}\nDrop Chance: ${stats.drop_chance.toFixed(2)}%`,
        inline: true
    };
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}