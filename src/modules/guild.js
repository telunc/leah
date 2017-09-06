import { Guild } from './database';

export default class {

    static async getGuilds() {
        return Guild.findAll().catch((error) => {
            console.error(error);
        });
    }

    static async getGuildWithId(id) {
        return Guild.findOne({ where: { id: id } }).catch((error) => {
            console.error(error);
        });
    }

    static async setGuild(post) {
        return Guild.create(post);
    }

    static async updateGuild(id, post) {
        let guild = await this.getGuildWithId(id);
        if (!guild) return;
        return guild.update(post);
    }

    static async deleteGuild(id) {
        return Guild.destroy({ where: { id: id } }).catch((error) => {
            console.error(error);
        });
    }

}