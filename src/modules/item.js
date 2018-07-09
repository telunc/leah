import rp from 'request-promise';
import redis from './redis';
import version from './version';
import { compareTwoStrings } from 'string-similarity';
import config from 'config';
import slugify from 'slugify';

export default class {

    static async getItems() {
        let cacheItems = await redis.getAsync('leah-items');
        if (cacheItems) return JSON.parse(cacheItems);
        let build = await version.getVersion().catch(() => {
            console.error('failed to load version');
        });
        let results = await rp({ uri: `http://ptr.d3planner.com/api/${build}/items`, gzip: true, json: true }).catch(() => {
            console.error('failed to load items');
        });
        if (!results) return;
        let items = Object.keys(results).map((item) => {
            results[item].id = `${slugify(results[item].name, {lower: true})}-${item}`;
            return results[item];
        });
        await redis.set('leah-items', JSON.stringify(items), 'EX', 86400);
        return items;
    }

    static async getItemsWithId(region, id) {
        let cacheItem = await redis.getAsync(`leah-${region}-items-${id}`);
        if (cacheItem) return JSON.parse(cacheItem);
        let item = await rp({ uri: `https://${region}.api.battle.net/d3/data/item/${id}?apikey=${config.get('battle-net').key}`, json: true }).catch(() => {
            console.error(`failed to items with id ${id} in ${region} region`);
        });
        if (!item) return;
        await redis.set(`leah-${region}-items-${id}`, JSON.stringify(item), 'EX', 86400);
        return item;
    }

    static async getItemWithName(region, name) {
        let items = await this.getItems();
        if (!items) return;
        items.forEach((item) => {
            if (name && item.name) {
                item.similarity = compareTwoStrings(name, item.name);
                if (item.powers) item.similarity += 0.0001;
                if (item.id.includes('P61')) item.similarity -= 0.0001;
            } else {
                item.similarity = 0;
            }
        });
        items.sort((a, b) => {
            return b.similarity - a.similarity;
        });
        return this.getItemsWithId(region, items[0].id);
    }

}