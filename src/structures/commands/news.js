import News from '../../modules/news';

export default async(tokens, message) => {

    let arg = Number(tokens.shift());
    if (!arg) return message.channel.send('', {
        embed: {
            title: 'Help: News',
            description: 'To use this command, please supply a number from 1 to 10\nFor example, `leah news 3`',
            color: 0x33A2FF
        }
    });

    let index = 1;
    if (arg >= 1 && arg <= 10) index = arg;
    let news = await News.getNewsWithIndex(index - 1);

    message.channel.send('', {
        embed: {
            color: 0x33A2FF,
            title: news.title,
            description: news.description,
            thumbnail: {
                url: news.image
            },
            url: news.uri
        }
    });

};