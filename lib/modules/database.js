'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.News = exports.Guild = undefined;

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// configure database
var sequelize = new _sequelize2.default(_config2.default.get('database').database, _config2.default.get('database').user, _config2.default.get('database').password, {
    host: _config2.default.get('database').host,
    dialect: 'mysql',
    logging: false
});

// test connection
sequelize.authenticate().then(function () {
    console.log('Database connected');
}).catch(function (error) {
    console.error('Connection error:', error);
});

// schema
var Guild = sequelize.define('guild', {
    id: { type: _sequelize2.default.BIGINT, primaryKey: true },
    prefix: { type: _sequelize2.default.STRING },
    sub_id: { type: _sequelize2.default.BIGINT },
    region: { type: _sequelize2.default.STRING }
}, {
    timestamps: false
});

var News = sequelize.define('news', {
    id: { type: _sequelize2.default.BIGINT, autoIncrement: true, primaryKey: true },
    uri: { type: _sequelize2.default.STRING },
    image: { type: _sequelize2.default.STRING },
    title: { type: _sequelize2.default.STRING },
    description: { type: _sequelize2.default.TEXT }
});

// sync database
sequelize.sync({ alter: true });

exports.Guild = Guild;
exports.News = News;