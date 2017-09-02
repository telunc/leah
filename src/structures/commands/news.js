import News from '../../modules/news';

export default async(tokens, message) => {

    let index = 1;
    let arg = Number(tokens.shift());
    if (arg >= 1 && arg <= 6) index = arg;
    let news = await News.getNewsWithIndex(index-1);

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