import project from '../../../package.json';

const version = project.version;
const name = capitalizeFirstLetter(project.name);

const help =
`\`\`\`css
[${name} - v${version}]

sub                     News subscription
config                  Diablo server region
news     [1~6]          Latest 1~6 news
item     [name]         Item detail
career   [battle tag]   Career profile 
hero     [battle tag]   Hero profile
ping                    ${name} latency
prefix   [new prefix]   Change prefix
prefix                  Reset to default prefix
help                    Show this message
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