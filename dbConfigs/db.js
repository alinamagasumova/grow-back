const Sequelize = require('sequelize');
const { TARIFF_VALUES, PAY_STATUS_VALUES } = require('./models_config');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false,
    underscored: true,
  }
});

async function push_statuses(status_model) {
  const statuses = await status_model.findAll();
  if (statuses.length != 0) return
  PAY_STATUS_VALUES.forEach(val => {
    status_model.create({tariff_status: val});  
  });
  const result = await sequelize.query('ALTER TABLE masters ALTER COLUMN tariff_status_id SET DEFAULT 3');
  if (result) console.log('statuses pushed');
}

async function push_tariffs(tariff_model) {
  const tariffs = await tariff_model.findAll();
  if (tariffs.length != 0) return
  const result = await tariff_model.bulkCreate(TARIFF_VALUES, { validate: true });
  if (result) console.log(`tariffs pushed`);
}

async function init(db) {
  db.sequelize.sync({ alter : true })
    .then(() => console.log('connection to main db successful'))
    .then(() => { push_statuses(sequelize.models.Tariff_status); push_tariffs(sequelize.models.Tariff) })
    .catch(error => console.log('unable to sync models:', error));
}

function drop(db) {
  db.sequelize.drop({force: true}).then(()=>console.log('dropped db')).catch(error => console.error('unable to sync models:', error));
}

module.exports = {sequelize, init, drop}