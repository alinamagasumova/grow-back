const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Subservice = sequelize.define('Subservice', {
    id_subservice: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subservice_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subservice_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Service,
          key: 'id_service',
        }
      },
});