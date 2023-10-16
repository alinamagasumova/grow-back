const Sequelize = require('sequelize');
const values = process.env.PAY_STATUS_VALUES.split(',');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false,
    underscored: true,
  }
});

async function push_statuses(status_model){
  values.forEach(val => {
    status_model.create({tariff_status: val});  
  });
  console.log('statuses pushed');
  await sequelize.query('ALTER TABLE masters ALTER COLUMN tariff_status_id SET DEFAULT 3');
}

async function init(db) {
  db.sequelize.sync({ alter: true })
    .then(()=>console.log('connection to main db successful'))
    .then(()=>{ return sequelize.models.Tariff_status.findAll() })
    .then(result=>{ if (result.length == 0) push_statuses(sequelize.models.Tariff_status) })
    .catch(error =>console.log('unable to sync models:', error));
}

function drop(db) {
  db.sequelize.drop({force: true}).then(()=>console.log('dropped db')).catch(error => console.error('unable to sync models:', error));
}

module.exports = {sequelize, init, drop}