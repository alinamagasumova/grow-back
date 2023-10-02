const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Calendar_slot = sequelize.define('Calendar_slot', {
    id_calendar_slot: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    busy: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    master_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Master,
          key: 'id_master',
        }
    },
});