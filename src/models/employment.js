const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Employment = sequelize.define('Employment', {
    id_employment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    submaster_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Submaster,
          key: 'id_submaster',
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
    subservice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Subservice,
          key: 'id_subservice',
        }
    },
});