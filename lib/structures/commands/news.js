'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _news = require('../../modules/news');

var _news2 = _interopRequireDefault(_news);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function (tokens, message) {

    var arg = Number(tokens.shift());
    if (!arg) return message.channel.send('', {
        embed: {
            title: 'Help: News',
            description: 'To use this command, please supply a number from 1 to 10\nFor example, `leah news 3`',
            color: 0x33A2FF
        }
    });

    var index = 1;
    if (arg >= 1 && arg <= 10) index = arg;
    var news = await _news2.default.getNewsWithIndex(index - 1);

    message.channel.send('', {
        embed: {
            color: 0x33A2FF,
            title: news.title,
            description: news.description,
            thumbnail: {
                url: news.image
            },
            url: news.uri
        }
    });
};