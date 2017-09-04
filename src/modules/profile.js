import rp from 'request-promise';
import redis from './redis';
import config from 'config';

export default class {

    static async getCareer(battleTag) {
        let cacheCareer = await redis.getAsync(`career-${battleTag}`);
        if (cacheCareer) return JSON.parse(cacheCareer);
        let career = await rp({ uri: `https://us.api.battle.net/d3/profile/${battleTag}/?locale=en_US&apikey=${config.get('battle-net').key}`, json: true }).catch(() => {
            // console.error(`failed to fetch career with battleTag ${battleTag}`);
        });
        if (!career) return;
        await redis.set(`career-${battleTag}`, JSON.stringify(career), 'EX', 86400);
        return career;
    }

    static async getHero(battleTag, id) {
        let cacheHero = await redis.getAsync(`${battleTag}-${id}`);
        if (cacheHero) return JSON.parse(cacheHero);
        let hero = await rp({ uri: `https://us.api.battle.net/d3/profile/${battleTag}/hero/${id}?locale=en_US&apikey=${config.get('battle-net').key}`, json: true }).catch(() => {
            // console.error(`failed to fetch hero with id ${id}`);
        });
        if (!hero) return;
        await redis.set(`${battleTag}-${id}`, JSON.stringify(hero), 'EX', 86400);
        return hero;
    }

}