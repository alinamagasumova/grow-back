const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Tariff_status = sequelize.define('Tariff_status', {
    id_tariff_status: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tariff_status: {
        type: DataTypes.ENUM,
        values: process.env.STATUS_VALUES.split(','),
        allowNull: false
    }
});