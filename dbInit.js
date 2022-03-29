const Sequelize = require('sequelize');
const { SQL_USER, SQL_PASS } = require('./config.json');

const sequelize = new Sequelize('database', SQL_USER, SQL_PASS, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

/*const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);
require('./models/User-tag.js')(sequelize, Sequelize.DataTypes);*/
const CurrencyShop = require('./models/User-tag.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {

	console.log('Database synced');

	sequelize.close();
}).catch(console.error);