const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Tariff = sequelize.define('Tariff', {
    id_tariff: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tariff_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    tariff_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});