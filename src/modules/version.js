import rp from 'request-promise';
import redis from './redis';

export default class {

    static async getVersion() {
        let cacheVersion = await redis.getAsync('version');
        if (cacheVersion) return JSON.parse(cacheVersion);
        let results = await rp({ uri: 'https://www.d3planner.com/api/versions.php', gzip: true, json: true }).catch(() => {
            console.error('failed to load versions');
        });
        if (!results) return;
        if (!results.versions) return;
        let version = Object.keys(results.versions)[Object.keys(results.versions).length - 1];
        await redis.set('version', JSON.stringify(version), 'EX', 86400);
        return version;
    }

}