'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _htmlEntities = require('html-entities');

var _database = require('./database');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var news_regex = /<a href="([^"]*)" itemprop="url">[ \r\n\t]*<div class="article-image" style="background-image:url\(([^)]*)\)">[ \r\n\t]*<div class="article-image-frame"><\/div>[ \r\n\t]*<\/div>[ \r\n\t]*<div class="article-content" itemprop="blogPost" itemscope="itemscope" itemtype="http:\/\/schema.org\/BlogPosting">[ \r\n\t]*<h2 class="header-2" >[ \r\n\t]*<span class="article-title" itemprop="headline">[ \r\n\t]*([^\n]*)[ \r\n\t]*<\/span>[ \r\n\t]*<\/h2>[ \r\n\t]*<span class="clear"><!-- --><\/span>[ \r\n\t]*<div class="article-summary" itemprop="description">([^<]*)/igm;

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, null, [{
        key: 'scrapeNews',
        value: async function scrapeNews() {
            try {
                return await (0, _requestPromise2.default)({ url: 'https://us.diablo3.com/en/' }).catch(function () {
                    console.error('failed to fetch news');
                });
            } catch (error) {
                console.error('failed to fetch rss', error);
            }
        }
    }, {
        key: 'getNews',
        value: async function getNews() {
            var body = await this.scrapeNews();
            if (!body) return;
            var match = void 0;
            var news = [];
            while (match = news_regex.exec(body)) {
                var _match = match,
                    _match2 = _slicedToArray(_match, 5),
                    uri = _match2[1],
                    image = _match2[2],
                    title = _match2[3],
                    description = _match2[4];

                news.push({
                    uri: uri.startsWith('http') ? uri : 'https://us.diablo3.com' + uri,
                    image: 'http:' + image,
                    title: _htmlEntities.XmlEntities.decode(title),
                    description: _htmlEntities.XmlEntities.decode(description)
                });
            }
            return news;
        }
    }, {
        key: 'getNewsWithIndex',
        value: async function getNewsWithIndex(index) {
            var results = await this.getNews();
            if (!results) return;
            return results[index];
        }
    }, {
        key: 'setNews',
        value: async function setNews(post) {
            var result = await _database.News.findOne({ where: { uri: post.uri } });
            if (result) return;
            var news = await _database.News.create(post).catch(function () {
                // console.error('failed to insert');
            });
            return news.dataValues;
        }
    }, {
        key: 'getNewsAdded',
        value: async function getNewsAdded() {
            var _this = this;

            var news = await this.getNews();
            if (!news) return;
            var promises = [];
            news.forEach(function (post) {
                promises.push(_this.setNews(post));
            });
            var added = await Promise.all(promises);
            return added.filter(function (post) {
                return post;
            });
        }
    }]);

    return _class;
}();

exports.default = _class;