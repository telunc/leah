import rp from 'request-promise';
import redis from './redis';
import config from 'config';

let regex = /https:\/\/us.api.battle.net\/data\/d3\/([^/]*)\/([^/]*)\/leaderboard\/([^?]*)/;

export default class {

    static async getToken() {
        let cacheToken = await redis.getAsync('token');
        if (cacheToken) return cacheToken;
        let result = await rp({ uri: `https://us.battle.net/oauth/token?grant_type=client_credentials&client_id=${config.get('battle-net').key}&client_secret=${config.get('battle-net').secret}`, json: true }).catch((error) => {
            console.error('failed to fetch access token', error);
        });
        if (!result) return;
        await redis.set('token', result.access_token, 'EX', result.expires_in);
        return result.access_token;
    }

    static async getEra(era) {
        let cacheEra = await redis.getAsync(`era-${era}`);
        if (cacheEra) return JSON.parse(cacheEra);
        let token = await this.getToken();
        let result = await rp({ uri: `https://us.api.battle.net/data/d3/era/${era}?access_token=${token}`, json: true }).catch((error) => {
            console.error('failed to fetch era index', error);
        });
        if (!result) return;
        let leaderboards = buildLeaderboard(result);
        await redis.set(`era-${era}`, JSON.stringify(leaderboards), 'EX', 86400);
        return leaderboards;
    }

    static async getSeason(season) {
        let cacheSeason = await redis.getAsync(`season-${season}`);
        if (cacheSeason) return JSON.parse(cacheSeason);
        let token = await this.getToken();
        let result = await rp({ uri: `https://us.api.battle.net/data/d3/season/${season}?access_token=${token}`, json: true }).catch((error) => {
            console.error('failed to fetch season index', error);
        });
        if (!result) return;
        let leaderboards = buildLeaderboard(result);
        await redis.set(`season-${season}`, JSON.stringify(leaderboards), 'EX', 86400);
        return leaderboards;
    }

    static async getCareer(region, battleTag) {
        let cacheCareer = await redis.getAsync(`career-${region}-${battleTag}`);
        if (cacheCareer) return JSON.parse(cacheCareer);
        let career = await rp({ uri: `https://${region}.api.battle.net/d3/profile/${battleTag}/?apikey=${config.get('battle-net').key}`, json: true }).catch(() => {
            // console.error(`failed to fetch career with battleTag ${battleTag}`);
        });
        if (!career) return;
        await redis.set(`career-${region}-${battleTag}`, JSON.stringify(career), 'EX', 86400);
        return career;
    }

    static async getHero(region, battleTag, id) {
        let cacheHero = await redis.getAsync(`${region}-${battleTag}-${id}`);
        if (cacheHero) return JSON.parse(cacheHero);
        let hero = await rp({ uri: `https://${region}.api.battle.net/d3/profile/${battleTag}/hero/${id}?apikey=${config.get('battle-net').key}`, json: true }).catch(() => {
            // console.error(`failed to fetch hero with id ${id}`);
        });
        if (!hero) return;
        await redis.set(`${region}-${battleTag}-${id}`, JSON.stringify(hero), 'EX', 86400);
        return hero;
    }

}

function buildLeaderboard(json) {
    let leaderboards = [];
    json.leaderboard.forEach((object) => {
        let match = regex.exec(object.ladder.href);
        if (match) {
            let [, , , leaderboard] = match;
            leaderboards.push(leaderboard);
        }
    });
    return leaderboards;
}