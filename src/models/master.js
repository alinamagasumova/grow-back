const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Master = sequelize.define('Master', {
  id_master: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salon_adress: {
    type: DataTypes.GEOGRAPHY('POINT'),
    allowNull: false
  },
  salon_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active_till: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tariff_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tariff,
      key: 'id_tariff',
    }
  },
  tariff_status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tariff_status,
      key: 'id_tariff_status',
    }
  },
});