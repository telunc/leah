export default (message) => {

    let start = message.createdTimestamp;

    message.channel.send('Leah responded').then((message) => {
        let diff = (message.createdTimestamp - start);
        message.edit(`Leah responded in *${diff/1000} seconds*`);
    }).catch((error) => console.log(error));

};