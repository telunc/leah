import rp from 'request-promise';
import { XmlEntities } from 'html-entities';
import { News } from './database';

let news_regex = /<a href="([^"]*)" itemprop="url">[ \r\n\t]*<div class="article-image" style="background-image:url\(([^)]*)\)">[ \r\n\t]*<div class="article-image-frame"><\/div>[ \r\n\t]*<\/div>[ \r\n\t]*<div class="article-content" itemprop="blogPost" itemscope="itemscope" itemtype="http:\/\/schema.org\/BlogPosting">[ \r\n\t]*<h2 class="header-2" >[ \r\n\t]*<span class="article-title" itemprop="headline">[ \r\n\t]*([^\n]*)[ \r\n\t]*<\/span>[ \r\n\t]*<\/h2>[ \r\n\t]*<span class="clear"><!-- --><\/span>[ \r\n\t]*<div class="article-summary" itemprop="description">([^<]*)/igm;

export default class {

    static async scrapeNews() {
        try {
            return await rp({ url: 'https://us.battle.net/d3/en/' }).catch(() => {
                console.error('failed to fetch news');
            });
        } catch (error) {
            console.error('failed to fetch rss', error);
        }
    }

    static async getNews() {
        let body = await this.scrapeNews();
        if (!body) return;
        let match;
        let news = [];
        while (match = news_regex.exec(body)) {
            let [, uri, image, title, description] = match;
            news.push({
                uri: (uri.startsWith('http')) ? uri : 'https://us.battle.net' + uri,
                image: 'http:' + image,
                title: XmlEntities.decode(title),
                description: XmlEntities.decode(description)
            });
        }
        return news;
    }

    static async getNewsWithIndex(index) {
        let results = await this.getNews();
        return results[index];
    }

    static async setNews(post) {
        let result = await News.findOne({ where: { uri: post.uri } });
        if (result) return;
        let news = await News.create(post).catch(() => {
            // console.error('failed to insert');
        });
        return news.dataValues;
    }

    static async getNewsAdded() {
        let news = await this.getNews();
        let promises = [];
        news.forEach((post) => {
            promises.push(this.setNews(post));
        });
        let added = await Promise.all(promises);
        return added.filter(function(post) { return post; });
    }

}