import project from '../../../package.json';

const version = project.version;
const name = capitalizeFirstLetter(project.name);

const help =
    `\`\`\`css
[${name} - v${version}]

sub    : News subscription
config : Diablo server region
news   : Specifc news
item   : Item detail
career : Career profile 
hero   : Hero profile
season : Seasonal Leaderboard Rank
era    : Era Leaderboard Rank
ping   : ${name} latency
prefix : Change prefix
about  : About ${name}
weekly : Challenge rift reset time
reset  : Reset guild configuration
help   : Show this message
\`\`\`

**Website:**
<http://leah.moe>

**Donate:**
<https://www.patreon.com/leahbot>

**Support:**
https://discord.gg/etpF4PB`;

export default async(message) => {
    if (message.channel.type !== 'dm') message.channel.send('Okay, Check your Private Message!');
    message.author.send(help);
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}