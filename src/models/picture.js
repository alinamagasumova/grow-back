const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Picture = sequelize.define('Picture', {
    id_picture: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    picture: {
        type: DataTypes.BLOB,
        allowNull: false
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