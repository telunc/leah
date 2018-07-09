'use strict';

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _news = require('../news');

var _news2 = _interopRequireDefault(_news);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var io = (0, _socket2.default)();

io.on('connection', function () {
    console.log('Connected with socket');
});

setInterval(async function () {
    var news = await _news2.default.getNewsAdded();
    if (news.length) io.emit('news', news);
}, 300000);

io.listen(80);