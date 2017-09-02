import io from 'socket.io-client';
import Guild from '../guild';

var socket = io.connect('http://localhost');

export default (client) => {

    socket.on('news', async(posts) => {

        let guilds = await Guild.getGuilds();
        guilds.forEach((guild) => {
            let channel = client.channels.get(guild.sub_id);
            if (!channel) return;
            posts.forEach((post) => {
                channel.send('', { embed: { color: 0x33A2FF, title: post.title, description: post.description, thumbnail: { url: post.image }, url: post.uri } });
            });
        });
    });

};