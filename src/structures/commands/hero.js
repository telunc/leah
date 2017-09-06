import Profile from '../../modules/profile';
import Guild from '../../modules/guild';

let collectors = new Map();

export default async(tokens, message) => {

    if (!tokens.length) return;

    let battleTag = tokens.shift();
    let id = (message.guild) ? message.guild.id : message.channel.id;
    let guild = await Guild.getGuildWithId(id);
    let region = (guild) ? guild.region : 'US';

    let heroes = await buildCareer(message, region, battleTag);
    if (!heroes) return;

    let choice = await collector(message);
    if (!heroes[choice-1]) return message.channel.send({ embed: { title: 'Request cancelled', color: 0xFF33A2 } });
    
    let hero = await Profile.getHero(region, battleTag, heroes[choice-1].id);
    if (!hero) return;

    let description = '';
    description += `Class: ${capitalizeFirstLetter(hero.class)}\n`;
    description += `Gender: ${(hero.gender) ? 'Female' : 'Male'}\n`;
    description += `Level: ${(hero.level)}\n`;
    if (hero.hardcore) description += 'Hardcore\n';
    if (hero.seasonal) description += 'Seasonal\n';
    if (hero.paragonLevel !== 0) description += `Paragon Level: ${hero.paragonLevel}\n`;
    if (hero.seasonCreated !== 0) description += `Season Created: ${hero.seasonCreated}\n`;
    if (hero.kills.elites !== 0) description += `Elite kills: ${hero.kills.elites}\n`;

    let stats = '';
    if (hero.stats.life !== 0) stats += `Life: ${hero.stats.life}\n`;
    if (hero.stats.damage !== 0) stats += `Damage: ${hero.stats.damage}\n`;
    if (hero.stats.toughness !== 0) stats += `Toughness: ${hero.stats.toughness}\n`;
    if (hero.stats.healing !== 0) stats += `Healing: ${hero.stats.healing}\n`;
    if (hero.stats.attackSpeed !== 0) stats += `Attack Speed: ${hero.stats.attackSpeed.toFixed(2)}\n`;
    if (hero.stats.armor !== 0) stats += `Armor: ${hero.stats.armor}\n`;
    if (hero.stats.strength !== 0) stats += `Strength: ${hero.stats.strength}\n`;
    if (hero.stats.dexterity !== 0) stats += `Dexterity: ${hero.stats.dexterity}\n`;
    if (hero.stats.vitality !== 0) stats += `Vitality: ${hero.stats.vitality}\n`;
    if (hero.stats.intelligence !== 0) stats += `Intelligence: ${hero.stats.intelligence}\n`;
    if (hero.stats.physicalResist !== 0) stats += `Physical Resist: ${hero.stats.physicalResist}\n`;
    if (hero.stats.fireResist !== 0) stats += `Fire Resist: ${hero.stats.fireResist}\n`;
    if (hero.stats.coldResist !== 0) stats += `Cold Resist: ${hero.stats.coldResist}\n`;
    if (hero.stats.lightningResist !== 0) stats += `Lightning Resist: ${hero.stats.lightningResist}\n`;
    if (hero.stats.poisonResist !== 0) stats += `Poison Resist: ${hero.stats.poisonResist}\n`;
    if (hero.stats.arcaneResist !== 0) stats += `Arcane Resist: ${hero.stats.arcaneResist}\n`;
    if (hero.stats.critDamage !== 0) stats += `Crit Damage: ${hero.stats.critDamage.toFixed(2)}\n`;
    if (hero.stats.blockChance !== 0) stats += `Block Chance: ${hero.stats.blockChance}\n`;
    if (hero.stats.thorns !== 0) stats += `Thorns: ${hero.stats.thorns}\n`;
    if (hero.stats.lifeSteal !== 0) stats += `Life Steal: ${hero.stats.lifeSteal}\n`;
    if (hero.stats.lifePerKill !== 0) stats += `Life Per Kill: ${hero.stats.lifePerKill}\n`;
    if (hero.stats.goldFind !== 0) stats += `Gold Find: ${hero.stats.goldFind.toFixed(2)}\n`;
    if (hero.stats.magicFind !== 0) stats += `Magic Find: ${hero.stats.magicFind.toFixed(2)}\n`;
    if (hero.stats.damageIncrease !== 0) stats += `Damage Increase: ${hero.stats.damageIncrease}\n`;
    if (hero.stats.critChance !== 0) stats += `Crit Chance: ${hero.stats.critChance.toFixed(2)}\n`;
    if (hero.stats.damageReduction !== 0) stats += `Damage Reduction: ${hero.stats.damageReduction}\n`;
    if (hero.stats.lifeOnHit !== 0) stats += `life On Hit: ${hero.stats.lifeOnHit}\n`;
    if (hero.stats.primaryResource !== 0) stats += `Primary Resource: ${hero.stats.primaryResource}\n`;
    if (hero.stats.secondaryResource !== 0) stats += `Secondary Resource: ${hero.stats.secondaryResource}\n`;

    let skills = '';
    hero.skills.active.forEach((slot) =>{
        if (slot.skill) {
            skills += slot.skill.name;
            if (slot.rune) skills += `: ${slot.rune.name}`;
            skills += '\n';
        }
    });

    hero.skills.passive.forEach((slot) =>{
        if (slot.skill) skills += `${slot.skill.name}\n`;
    });

    let items = '';
    for (let key in hero.items) {
        items += `${hero.items[key].name}\n`;
    }

    let fields = [];
    if (stats.length) fields.push({name: 'Stats', value: stats, inline: true});
    if (items.length) fields.push({name: 'Items', value: items, inline: true});
    if (skills.length) fields.push({name: 'Skills', value: skills, inline: true});
    
    let embed = { title: hero.name };
    embed.color = 0xFF33A2;
    embed.description = description;
    if (fields.length) embed.fields = fields;
    embed.thumbnail = { url: 'https://i.pinimg.com/originals/1d/ae/1a/1dae1ad263fbac22a9296014871cb980.png' };

    message.channel.send('', {
        embed: embed
    });

};

async function buildCareer(message, region, battleTag){
    let career = await Profile.getCareer(region, battleTag);
    if (!career || career.code) return message.reply('No Result Found');

    let user = message.author;
    let avatar = user.avatar ? (user.avatar.startsWith('a_') ? `​https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif` : `​https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`) : user.defaultAvatarURL;
    avatar = avatar.replace(/[^a-zA-Z0-9_\-./:]/, '');
    avatar += '?size=1024';

    let fields = [];
    career.heroes.forEach((hero, index) => {
        let value = '';
        if (hero.seasonal) value += 'Seasonal • ';
        if (hero.hardcore) value += 'Hardcore • ';
        value += `${(hero.gender) ? 'Female' : 'Male'} • `;
        value += capitalizeFirstLetter(hero.class);

        fields.push({
            name: `${index+1}. ${hero.name} (${(hero.level < 70) ? hero.level : hero.paragonLevel})`,
            value: value
        });
    });

    let embed = {};
    embed.author = { name: `${user.username}#${user.discriminator}`, icon_url: avatar };
    embed.color = 0xFF33A2;
    embed.description = 'Enter any other key to cancel:';
    if (fields.length) embed.fields = fields;

    await message.channel.send('', {
        embed: embed
    });

    return career.heroes;
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}