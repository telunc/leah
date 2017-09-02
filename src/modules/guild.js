import { Guild } from './database';

export default class Guilds {

    static async getGuildWithId(id) {
        return Guild.findOne({ where: { id: id } }).catch((error) => {
            console.error(error);
        });
    }

}