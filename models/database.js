const { SQL_USER, SQL_PASS } = require('../config.json');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', SQL_USER, SQL_PASS, {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
})

const Tags = sequelize.define('tags', {
  name:{
    type: Sequelize.STRING,
  },
  description:{
    type: Sequelize.STRING,
  },
  username:{
    type: Sequelize.STRING,
  },
  usage_count: {
    type: Sequelize.NUMBER,
    defaultValue: 0
  }
});

const Patzicoin = sequelize.define('patzicoin', {
  userID: {
    type: Sequelize.STRING,
  },
  coins: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  inv: {
    type: Sequelize.STRING,
    defaultValue: '[]'
  }
})

module.exports = { Tags, Patzicoin }