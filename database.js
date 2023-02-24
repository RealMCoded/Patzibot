const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', "", "", {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite'
})

const Patzicoin = sequelize.define('patzicoin', {
  userID: {
    type: Sequelize.STRING,
  },
  coins: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  bank:{
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  lastDailyClaimDate: {
    type: Sequelize.STRING,
    defaultValue: "0"
  },
  lastBegClaimDate: {
    type: Sequelize.STRING,
    defaultValue: "0"
  },
  /*lastRobDate: {
    type: Sequelize.STRING,
    defaultValue: "0"
  },*/
  inv: {
    type: Sequelize.STRING,
    defaultValue: '[]'
  }/*,
  settings: {
    type: Sequelize.STRING,
    defaultValue: '{"canDmOnBegCooldown":true,"hasDmOnBegCooldown"false,"canBossDM":false}'
  }*/
})

module.exports = { Tags, Patzicoin }