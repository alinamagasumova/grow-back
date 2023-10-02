const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Appointment = sequelize.define('Appointment', {
    id_appointment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    client_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Client,
          key: 'id_client',
        }
    },
    subservice_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Subservice,
          key: 'id_subservice',
        }
    },
    calendar_slot_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Calendar_slot,
          key: 'id_calendar_slot',
        }
    },
});