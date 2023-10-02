const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Client = sequelize.define('Client', {
  id_client: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /\+7[0-9]{10}/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  master_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Master,
      key: 'id_master',
    }
  },
  submaster_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Submaster,
      key: 'id_submaster',
    }
  },
});