'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _set = require('../../modules/set');

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (tokens, message) {
    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Set',
            description: 'To use this command, please supply an item set name\nFor example, `leah set Bones of Rathma`',
            color: 0x33FF3D
        }
    });
    var name = tokens.join(' ');
    var set = await _set2.default.getSetWithName(name);
    if (!set) message.reply('', { embed: { title: 'No Result Found' } });

    var fields = [];
    if (set[2]) fields.push({ name: '2 pieces', value: set[2].toString() });
    if (set[3]) fields.push({ name: '3 pieces', value: set[3].toString() });
    if (set[4]) fields.push({ name: '4 pieces', value: set[4].toString() });
    if (set[5]) fields.push({ name: '5 pieces', value: set[5].toString() });
    if (set[6]) fields.push({ name: '6 pieces', value: set[6].toString() });

    var embed = {};
    embed.title = set.name;
    embed.fields = fields;
    embed.color = 0x33FF3D;

    message.channel.send('', {
        embed: embed
    });
};