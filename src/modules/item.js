import rp from 'request-promise';
import redis from './redis';
import { compareTwoStrings } from 'string-similarity';
import config from 'config';

export default class {

    static async getItems() {
        let cacheItems = await redis.getAsync('items');
        if (cacheItems) return JSON.parse(cacheItems);
        let results = await rp({ uri: 'http://ptr.d3planner.com/game/json/items', gzip: true, json: true });
        let items = Object.keys(results).map((item) => {
            results[item].id = item;
            return results[item];
        });
        await redis.set('items', JSON.stringify(items), 'EX', 86400);
        return items;
    }

    static async getItemsWithId(id) {
        let cacheItem = await redis.getAsync(`items-${id}`);
        if (cacheItem) return JSON.parse(cacheItem);
        let item = await rp({ uri: `https://us.api.battle.net/d3/data/item/${id}?locale=en_US&apikey=${config.get('battle-net').key}`, json: true });
        await redis.set(`items-${id}`, JSON.stringify(item), 'EX', 86400);
        return item;
    }

    static async getItemWithName(name) {
        let items = await this.getItems();
        items.forEach((item) => {
            if (name && item.name) {
                item.similarity = compareTwoStrings(name, item.name);
                if (item.id.includes('_x1')) item.similarity += 0.001;
            } else {
                item.similarity = 0;
            }
        });
        items.sort((a, b) => {
            return b.similarity - a.similarity;
        });
        return this.getItemsWithId(items[0].id);
    }

}