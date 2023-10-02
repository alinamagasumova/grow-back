const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Basket = sequelize.define('Basket', {
  id_basket: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Appointment,
      key: 'id_appointment',
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id_product',
    }
  },
});