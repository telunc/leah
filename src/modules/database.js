import config from 'config';
import Sequelize from 'sequelize';

// configure database
const sequelize = new Sequelize(
    config.get('database').database,
    config.get('database').user,
    config.get('database').password, {
        host: config.get('database').host,
        dialect: 'mysql',
        logging: false
    }
);

// test connection
sequelize.authenticate().then(() => {
    console.log('Database connected');
}).catch((error) => {
    console.error('Connection error:', error);
});

// schema
const Guild = sequelize.define('guild', {
    id: { type: Sequelize.BIGINT, primaryKey: true },
    prefix: { type: Sequelize.STRING },
    sub_id: { type: Sequelize.BIGINT },
    region: { type: Sequelize.STRING }
}, {
    timestamps: false
});

const News = sequelize.define('news', {
    id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true },
    uri: { type: Sequelize.STRING },
    image: { type: Sequelize.STRING },
    title: { type: Sequelize.STRING },
    description: { type: Sequelize.TEXT }
});

// sync database
sequelize.sync({ alter: true });

export { Guild, News };