import rp from 'request-promise';
import redis from './redis';
import config from 'config';

let regex = /battle.net\/data\/d3\/([^/]*)\/([^/]*)\/leaderboard\/([^?]*)/;

export default class {

    static async getToken(region) {
        let cacheToken = await redis.getAsync(`${region}-token`);
        if (cacheToken) return cacheToken;
        let result = await rp({ uri: `https://${region}.battle.net/oauth/token?grant_type=client_credentials&client_id=${config.get('battle-net').key}&client_secret=${config.get('battle-net').secret}`, json: true }).catch((error) => {
            console.error('failed to fetch access token', error);
        });
        if (!result) return;
        await redis.set(`${region}-token`, result.access_token, 'EX', result.expires_in);
        return result.access_token;
    }

    static async getEra(region, era) {
        let cacheEra = await redis.getAsync(`era-${region}-${era}`);
        if (cacheEra) return JSON.parse(cacheEra);
        let token = await this.getToken(region);
        let result = await rp({ uri: `https://${region}.api.battle.net/data/d3/era/${era}?access_token=${token}`, json: true }).catch(() => {
            // console.error('failed to fetch era index');
        });
        if (!result) return;
        let leaderboards = buildLeaderboard(result);
        await redis.set(`era-${region}-${era}`, JSON.stringify(leaderboards), 'EX', 86400);
        return leaderboards;
    }

    static async getEraLeaderboard(region, era, leaderboard) {
        let cacheLeaderboard = await redis.getAsync(`era-${region}-${leaderboard}`);
        if (cacheLeaderboard) return JSON.parse(cacheLeaderboard);
        let token = await this.getToken(region);
        let result = await rp({ uri: `https://${region}.api.battle.net/data/d3/era/${era}/leaderboard/${leaderboard}?access_token=${token}`, json: true }).catch((error) => {
            console.error('failed to fetch era leaderboard', error);
        });
        if (!result) return;
        await redis.set(`era-${region}-${leaderboard}`, JSON.stringify(result), 'EX', 86400);
        return result;
    }

    static async getSeason(region, season) {
        let cacheSeason = await redis.getAsync(`season-${region}-${season}`);
        if (cacheSeason) return JSON.parse(cacheSeason);
        let token = await this.getToken(region);
        let result = await rp({ uri: `https://${region}.api.battle.net/data/d3/season/${season}?access_token=${token}`, json: true }).catch(() => {
            // console.error('failed to fetch season index');
        });
        if (!result) return;
        let leaderboards = buildLeaderboard(result);
        await redis.set(`season-${region}-${season}`, JSON.stringify(leaderboards), 'EX', 86400);
        return leaderboards;
    }

    static async getSeasonLeaderboard(region, season, leaderboard) {
        let cacheLeaderboard = await redis.getAsync(`season-${region}-${leaderboard}`);
        if (cacheLeaderboard) return JSON.parse(cacheLeaderboard);
        let token = await this.getToken(region);
        let result = await rp({ uri: `https://${region}.api.battle.net/data/d3/season/${season}/leaderboard/${leaderboard}?access_token=${token}`, json: true }).catch((error) => {
            console.error('failed to fetch season leaderboard', error);
        });
        if (!result) return;
        await redis.set(`season-${region}-${leaderboard}`, JSON.stringify(result), 'EX', 86400);
        return result;
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
            if (!isNumeric(leaderboard)) leaderboards.push(leaderboard);
        }
    });
    return leaderboards;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}