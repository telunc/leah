'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _kadala = require('../../modules/kadala');

var _kadala2 = _interopRequireDefault(_kadala);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (tokens, message) {

    if (!tokens.length) return message.channel.send('', {
        embed: {
            title: 'Help: Cost',
            description: 'To use this command, please supply an item name\nFor example, `leah cost unity`',
            color: 0x7B33FF
        }
    });

    var name = tokens.join(' ');
    var item = await _kadala2.default.getKadalaItemWithName(name);
    if (!item) message.reply('', { embed: { title: 'No Result Found' } });

    var fields = [];
    if (item.barbarian) {
        var barbarian = await buildField(item, 'barbarian');
        if (barbarian) fields.push(barbarian);
    }
    if (item.crusader) {
        var crusader = await buildField(item, 'crusader');
        if (crusader) fields.push(crusader);
    }
    if (item.demonhunter) {
        var demonhunter = await buildField(item, 'demonhunter');
        if (demonhunter) fields.push(demonhunter);
    }
    if (item.monk) {
        var monk = await buildField(item, 'monk');
        if (monk) fields.push(monk);
    }
    if (item.necromancer) {
        var necromancer = await buildField(item, 'necromancer');
        if (necromancer) fields.push(necromancer);
    }
    if (item.witchdoctor) {
        var witchdoctor = await buildField(item, 'witchdoctor');
        if (witchdoctor) fields.push(witchdoctor);
    }
    if (item.wizard) {
        var wizard = await buildField(item, 'wizard');
        if (wizard) fields.push(wizard);
    }

    var _ref = await _kadala2.default.getKadala(),
        _ref2 = _slicedToArray(_ref, 2),
        types = _ref2[1];

    if (!types) return;

    var embed = {};
    embed.title = item.name;
    embed.description = 'Legendary ' + types[item.type].name + '\nRequired Level: ' + item.level;
    embed.color = 0x7B33FF;
    embed.fields = fields;

    message.channel.send('', { embed: embed });
};

async function buildField(item, hero) {
    var _ref3 = await _kadala2.default.getKadala(),
        _ref4 = _slicedToArray(_ref3, 4),
        heroes = _ref4[3];

    if (!heroes) return;
    var stats = await _kadala2.default.getKadalaCostWithItem(item, hero);
    if (!stats) return;
    return {
        name: heroes[hero],
        value: 'Bloodshard: ' + numberWithCommas(Math.floor(stats.average)) + '\nKadala Chance: ' + stats.shards_chance.toFixed(2) + '%\nDeath\'s Breath: ' + numberWithCommas(Math.floor(stats.breaths)) + '\nDrop Chance: ' + stats.drop_chance.toFixed(2) + '%',
        inline: true
    };
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}