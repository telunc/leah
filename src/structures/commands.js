import ping from './commands/ping';
import news from './commands/news';

export default {

    'ping': (tokens, message) => {
        return ping(message);
    },
    'news': (tokens, message) => {
        return news(tokens, message);
    }

};