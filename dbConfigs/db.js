const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false,
    underscored: true,
  }
});

function init(db) {
  db.sequelize.sync({ force: true })
    .then(()=>{console.log('dropped and resynced db');})
    .catch(error => {console.error('unable to sync models:', error)});
}

function drop(db) {
  db.sequelize.drop({force: true}).then(()=>console.log('dropped db')).catch(error => console.error('unable to sync models:', error));
}

module.exports = {sequelize, init, drop}