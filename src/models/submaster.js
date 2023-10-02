const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Submaster = sequelize.define('Submaster', {
  id_submaster: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_description: {
    type: DataTypes.STRING,
    allowNull: false
  },
});