const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Service = sequelize.define('Service', {
  id_service: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  master_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Master,
      key: 'id_master',
    }
  },
});