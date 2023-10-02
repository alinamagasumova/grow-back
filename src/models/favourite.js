const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Favourite = sequelize.define('Favourite', {
  id_favourite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id_client',
    }
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