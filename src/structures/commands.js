import ping from './commands/ping';

export default {

    'ping': (tokens, message) => {
        return ping(message);
    }

};