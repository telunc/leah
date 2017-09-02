import Discord from 'discord.js';
import config from 'config';
import tokenizer from './modules/tokenizer';
import commands from './structures/commands';

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
    let tokens = await tokenizer.getTokens(message);
    if (!tokens) return;
    let command = tokens.shift();
    if (commands.hasOwnProperty(command)) commands[command](tokens, message);
});

client.login(config.get('discord').token);