const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Feedback = sequelize.define('Feedback', {
  id_feedback: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      max: 5,            
      min: 1,
    }
  },
  feedback_description: {
    type: DataTypes.STRING
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