import rp from 'request-promise';
import redis from './redis';
import { compareTwoStrings } from 'string-similarity';

export default class {

    static async getSkills() {
        let cacheSkills = await redis.getAsync('leah-skills');
        if (cacheSkills) return JSON.parse(cacheSkills);
        let results = await rp({ uri: 'http://d3planner.com/game/json/powers', gzip: true, json: true }).catch(() => {
            console.error('failed to load skills');
        });
        if (!results) return;
        let skills = Object.keys(results).map((skill) => {
            results[skill].id = skill;
            return results[skill];
        });
        await redis.set('leah-skills', JSON.stringify(skills), 'EX', 86400);
        return skills;
    }

    static async getSkillWithName(name) {
        let skills = await this.getSkills();
        if (!skills) return;
        skills.forEach((skill) => {
            if (name && skill.name) {
                skill.similarity = compareTwoStrings(name, skill.name);
            } else {
                skill.similarity = 0;
            }
        });
        skills.sort((a, b) => {
            return b.similarity - a.similarity;
        });
        return skills[0];
    }

}