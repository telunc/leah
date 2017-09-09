import Item from '../../modules/item';
import Guild from '../../modules/guild';

export default async(tokens, message) => {

    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Item',
            description: 'To use this command, please supply an item name\nFor example, `leah item hellcat waistguard`',
            color: 0xFF33A2
        }
    });

    let id = (message.guild) ? message.guild.id : message.channel.id;
    let guild = await Guild.getGuildWithId(id);
    let region = (guild && guild.region) ? guild.region : 'US';


    let name = tokens.join(' ');
    let item = await Item.getItemWithName(region, name);
    if (!item) message.reply('', { embed: { title: 'No Result Found' } });
    let color = null;
    let description = '';

    if (item.typeName) description += item.typeName + '\n';
    if (item.requiredLevel) description += `Required Level: ${item.requiredLevel}\n`;
    if (item.itemLevel) description += `Item Level: ${item.itemLevel}\n`;
    if (item.description) description += `${item.description}\n`;
    if (item.displayColor) description += `Rarity: ${capitalizeFirstLetter(item.displayColor)}\n`;
    if (item.displayColor === 'orange') color = 0xff9433;
    if (item.displayColor === 'blue') color = 0x3349ff;
    if (item.displayColor === 'green') color = 0x33ff3d;
    if (item.dps && item.dps.min && item.dps.max) description += `Damage Per Second: ${item.dps.min.toFixed(2)}-${item.dps.max.toFixed(2)}\n`;
    if (item.damageRange && item.damageRange !== '0–0 Damage') description += `Damage: ${item.damageRange.replace(' Damage','')}\n`;
    if (item.damageRange && item.attacksPerSecondText) description += `Attacks per Second: ${item.attacksPerSecondText.replace(' Attacks per Second','')}\n`;
    if (item.attributesRaw && item.attributesRaw.Block_Chance_Item && item.attributesRaw.Block_Chance_Item.min && item.attributesRaw.Block_Chance_Item.max) description += `Chance of Block: ${item.attributesRaw.Block_Chance_Item.min*100}%-${item.attributesRaw.Block_Chance_Item.max*100}%\n`;
    if (item.attributesRaw && item.attributesRaw.Block_Amount_Item_Min && item.attributesRaw.Block_Amount_Item_Min.min && item.attributesRaw.Block_Amount_Item_Min.max && item.attributesRaw.Block_Amount_Item_Delta && item.attributesRaw.Block_Amount_Item_Delta.min && item.attributesRaw.Block_Amount_Item_Delta.max) description += `Block Amount: (${item.attributesRaw.Block_Amount_Item_Min.min}-${item.attributesRaw.Block_Amount_Item_Min.max})-(${item.attributesRaw.Block_Amount_Item_Min.min+item.attributesRaw.Block_Amount_Item_Delta.min}-${item.attributesRaw.Block_Amount_Item_Min.max+item.attributesRaw.Block_Amount_Item_Delta.max})\n`;
    if (item.armor && item.armor.min && item.armor.max) description += `Armor: ${item.armor.min}-${item.armor.max}\n`;

    let fields = [];
    if (item.attributes && item.attributes.primary.length) fields.push({ name: 'Primary', value: getAttributes(item.attributes.primary) });
    if (item.attributes && item.attributes.secondary.length) fields.push({ name: 'Secondary', value: getAttributes(item.attributes.secondary) });
    if (item.attributes && item.attributes.passive.length) fields.push({ name: 'Passive', value: getAttributes(item.attributes.passive) });
    if (item.set) fields.push({ name: 'Set', value: item.set.name });

    let embed = {};
    embed.title = item.name;
    embed.color = color;
    embed.description = description;

    if (item.flavorText) embed.footer = { text: `${item.flavorText}` };

    if (fields.length) embed.fields = fields;
    embed.thumbnail = { url: `https://blzmedia-a.akamaihd.net/d3/icons/items/large/${item.icon}.png` };

    message.channel.send('', {
        embed: embed
    });

};

function getAttributes(attributes) {
    let description = '';
    attributes.forEach((attribute) => {
        description += `${attribute.text}\n`;
    });
    return description;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}