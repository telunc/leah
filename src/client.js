import Discord from 'discord.js';
import config from 'config';
import tokenizer from './modules/tokenizer';
import commands from './structures/commands';
import socket from './modules/socket/client';
import support from './modules/support';

const client = new Discord.Client();
socket(client);
support(client);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({game: {name: `${config.get('discord').prefix}help`}});
});

client.on('message', async message => {
    if (message.author.bot) return;
    let tokens = await tokenizer.getTokens(message);
    if (!tokens) return;
    let command = tokens.shift();
    if (commands.hasOwnProperty(command)) commands[command](tokens, message, client);
});

client.login(config.get('discord').token);