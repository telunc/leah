import Item from '../../modules/item';

export default async(tokens, message) => {

    if (tokens.length === 0) return;

    let name = tokens.join(' ');
    let item = await Item.getItemWithName(name);

    let description = '';
    if (item.description) description += `${item.description}\n`;
    if (item.requiredLevel) description += `Required Level: ${item.requiredLevel}\n`;
    if (item.itemLevel) description += `Item Level: ${item.itemLevel}\n`;
    if (item.displayColor) description += `Rarity: ${capitalizeFirstLetter(item.displayColor)}\n`;
    if (item.damageRange && item.damageRange !== '0–0 Damage') description += `Damage: ${item.damageRange.replace(' Damage','')}\n`;
    if (item.damageRange && item.attacksPerSecondText) description += `Attacks per Second: ${item.attacksPerSecondText.replace(' Attacks per Second','')}\n`;
    if (item.armor) description += `Armor: ${item.armor.min}-${item.armor.max}\n`;

    let fields = [];
    if (item.attributes && item.attributes.primary.length > 0) fields.push({ name: 'Primary', value: getAttributes(item.attributes.primary) });
    if (item.attributes && item.attributes.secondary.length > 0) fields.push({ name: 'Secondary', value: getAttributes(item.attributes.secondary) });
    if (item.attributes && item.attributes.passive.length > 0) fields.push({ name: 'Passive', value: getAttributes(item.attributes.passive) });
    if (item.type && item.type.typeName) fields.push({ name: 'Type', value: item.typeName });
    if (item.set) fields.push({ name: 'Set', value: item.set.name });

    let embed = { title: item.name };
    embed.color = 0xFF33A2;
    embed.description = description;
    if (fields.length > 0) embed.fields = fields;
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