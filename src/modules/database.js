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
    console.log('Connected');
}).catch((error) => {
    console.error('Connection error:', error);
});

// schema
const Guild = sequelize.define('guild', {
    id: { type: Sequelize.BIGINT, primaryKey: true },
    prefix: { type: Sequelize.STRING }
}, {
    timestamps: false
});

// sync database
sequelize.sync({ force: false });

export { Guild };
