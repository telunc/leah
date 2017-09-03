import ping from './commands/ping';
import news from './commands/news';
import sub from './commands/sub';
import item from './commands/item';

export default {

    'ping': (tokens, message) => {
        return ping(message);
    },
    'news': (tokens, message) => {
        return news(tokens, message);
    },
    'sub': (tokens, message) => {
        return sub(message);
    },
    'item': (tokens, message) => {
        return item(tokens, message);
    }

};