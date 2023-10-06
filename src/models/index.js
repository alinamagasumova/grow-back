const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const path = require('path');
const fs = require('fs');
const db = {};

fs.readdirSync(__dirname)
    .forEach(file => {
         let model = path.basename(file, '.js');
         if (model != 'index') {
             db.model = require(__dirname + '/' + model)(sequelize, DataTypes);
         };
     });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ASSOCIATIONS
let m = sequelize.models;

// client and master
m.Master.hasOne(m.Client);
m.Client.belongsTo(m.Master);

// client and submaster
m.Submaster.hasOne(m.Client);
m.Client.belongsTo(m.Submaster);

// master and tariff
m.Tariff.hasMany(m.Master);
m.Master.belongsTo(m.Tariff, { foreignKey: { allowNull: false } });

// master and tariff status
m.Tariff_status.hasMany(m.Master);
m.Master.belongsTo(m.Tariff_status, { foreignKey: { allowNull: false } });

// picture and master


// product and master


// calendar slot and master


// service and master


// subservice and service



module.exports = db;