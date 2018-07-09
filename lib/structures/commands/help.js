'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _package = require('../../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = _package2.default.version;
var name = capitalizeFirstLetter(_package2.default.name);

var help = '```css\n[' + name + ' - v' + version + ']\n\nsub    : News subscription\nconfig : Diablo server region\nnews   : Specifc news\nitem   : Item detail\nset    : Item set detail\nskill  : Hero ability\ncost   : Legendary item cost\ncareer : Career profile \nhero   : Hero profile\nseason : Seasonal leaderboard rank\nera    : Era leaderboard rank\nping   : ' + name + ' latency\nprefix : Change prefix\nabout  : About ' + name + '\nweekly : Challenge rift reset time\nreset  : Reset guild configuration\nhelp   : Show this message\n```\n\n**Website:**\n<http://leah.moe>\n\n**Donate:**\n<https://www.patreon.com/leahbot>\n\n**Support:**\nhttps://discord.gg/etpF4PB';

exports.default = async function (message) {
    if (message.channel.type !== 'dm') message.channel.send('Okay, Check your Private Message!');
    message.author.send(help);
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}