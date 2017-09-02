import ping from './commands/ping';
import news from './commands/news';
import sub from './commands/sub';

export default {

    'ping': (tokens, message) => {
        return ping(message);
    },
    'news': (tokens, message) => {
        return news(tokens, message);
    },
    'sub': (tokens, message) => {
        return sub(message);
    }

};