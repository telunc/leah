import rp from 'request-promise';
import redis from './redis';
import { compareTwoStrings } from 'string-similarity';

export default class {

    static async getKadala() {
        let cache = await redis.getAsync('kadala');
        if (cache) return JSON.parse(cache);
        let script = await rp({ uri: 'http://d3planner.com/game/json/kadala', gzip: true }).catch(() => {
            console.error('failed to load kadala items');
        });
        if (!script) return;
        script += 'module.exports = Kadala;';
        let kadala = eval(script);
        if (!kadala.Items) return;
        let items = Object.keys(kadala.Items).map((item) => {
            kadala.Items[item].id = item;
            return kadala.Items[item];
        });
        await redis.set('kadala', JSON.stringify([items, kadala.ItemTypes, kadala.Types, kadala.Classes]), 'EX', 86400);
        return [items, kadala.ItemTypes, kadala.Types, kadala.Classes];
    }

    static async getKadalaItemWithName(name) {
        let [items] = await this.getKadala();
        if (!items) return;
        items.forEach((item) => {
            if (name && item.name) {
                item.similarity = compareTwoStrings(name, item.name);
            } else {
                item.similarity = 0;
            }
        });
        items.sort((a, b) => {
            return b.similarity - a.similarity;
        });
        return items[0];
    }

    static async getKadalaCostWithItem(item, hero) {
        let [items, types, costs] = await this.getKadala();
        if (!items || !types || !costs) return;
        if (!types[item.type]) return;
        let type = types[item.type].kadala;
        let cost = costs[type].cost;
        let weight = item.weight;
        let shards = 0;
        let drops = 0;
        items.forEach((piece) => {
            if (piece[hero] && types[piece.type] && types[piece.type].kadala === type) {
                shards += piece.weight;
            }
            if (piece[hero] && piece.type === item.type) {
                drops += piece.weight;
            }
        });
        return ({
            average: 10 * shards * cost / weight,
            breaths: drops * 25 / weight,
            shards_chance: weight / shards * 10,
            drop_chance: weight / drops * 100
        });
    }

}