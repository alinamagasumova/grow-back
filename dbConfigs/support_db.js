const { Sequelize, DataTypes } = require('sequelize');

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
        allowNull: false
    },
    client_id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: process.env.SUPPORT_STATUS_VALUES.split(','),
      allowNull: false
  },
}, {
  updatedAt: 'status_updatedAt'
});

function support_init(sequelize=sequelize_support) {
  sequelize.sync({ alter: true })
    .then(()=>{console.log('connection to support db successful');})
    .catch(error => console.log(error));
}

module.exports = { support_init, Support_request};