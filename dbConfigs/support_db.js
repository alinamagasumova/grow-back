const { Sequelize, DataTypes } = require('sequelize');
const { SUPPORT_STATUS_VALUES } = require('./models_config');

const sequelize_support = new Sequelize(process.env.SUPPORT_DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
  }
});

const Support_request = sequelize_support.define('support_request', {
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          
        }
    },
    client_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: SUPPORT_STATUS_VALUES,
      allowNull: false,
      defaultValue: 'open'
  },
}, {
  updatedAt: 'status_updatedAt'
});
// sequelize_support.drop({force: true}).then(()=>console.log('dropped db')).catch(error => console.error('unable to sync models:', error));

function support_init(sequelize=sequelize_support) {
  sequelize.sync({ alter: true })
    .then(()=>console.log('connection to support db successful'))
    .catch(error => console.log(error));
}

module.exports = { support_init, Support_request};