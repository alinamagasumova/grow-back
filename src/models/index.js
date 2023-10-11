const { Sequelize, DataTypes } = require('sequelize');
const {sequelize} = require('../../dbConfigs/db');
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
const m = sequelize.models;
// , { foreignKey: { allowNull: false } }
// client and master
m.Master.hasOne(m.Client);
m.Client.belongsTo(m.Master);

// client and submaster
m.Submaster.hasOne(m.Client);
m.Client.belongsTo(m.Submaster);

// master and tariff
m.Tariff.hasMany(m.Master, { foreignKey: { allowNull: false } });
m.Master.belongsTo(m.Tariff, { foreignKey: { allowNull: false } });

// master and tariff status
m.Tariff_status.hasMany(m.Master, { foreignKey: { allowNull: false } });
m.Master.belongsTo(m.Tariff_status, { foreignKey: { allowNull: false } });

// picture and master
m.Picture.belongsTo(m.Master, { foreignKey: { allowNull: false } });
m.Master.hasMany(m.Picture, { foreignKey: { allowNull: false } });

// product and master
m.Product.belongsTo(m.Master, { foreignKey: { allowNull: false } });
m.Master.hasMany(m.Product, { foreignKey: { allowNull: false } });

// master and calendar slot
m.Master.hasMany(m.Calendar_slot);
m.Calendar_slot.belongsTo(m.Master);

// service and master
m.Master.hasMany(m.Service, { foreignKey: { allowNull: false } });
m.Service.belongsTo(m.Master, { foreignKey: { allowNull: false } });

// submaster_subservices
m.Submaster.belongsToMany(m.Subservice, { through: 'submaster_subservices' });
m.Subservice.belongsToMany(m.Submaster, { through: 'submaster_subservices' });

// employment (master subamster)
m.Master.belongsToMany(m.Submaster, { through: 'employments' });
m.Submaster.belongsToMany(m.Master, { through: 'employments' });

// subservice and service
m.Service.hasMany(m.Subservice, { foreignKey: { allowNull: false } });
m.Subservice.belongsTo(m.Service, { foreignKey: { allowNull: false } });

// favourites
m.Client.belongsToMany(m.Master, { through: 'favourites' });
m.Master.belongsToMany(m.Client, { through: 'favourites' });

// feedback
m.Client.belongsToMany(m.Master, { through: m.Feedback });
m.Master.belongsToMany(m.Client, { through: m.Feedback });

// basket
m.Product.belongsToMany(m.Appointment, { through: 'baskets' });
m.Appointment.belongsToMany(m.Product, { through: 'baskets' })

// appointment and client
m.Client.hasMany(m.Appointment, { foreignKey: { allowNull: false } });
m.Appointment.belongsTo(m.Client, { foreignKey: { allowNull: false } });

// appointment and calendar
m.Calendar_slot.belongsTo(m.Appointment);
m.Appointment.hasOne(m.Calendar_slot);

// appointment_subservice
m.Appointment.belongsToMany(m.Subservice, { through: 'appointment_subservices' });
m.Subservice.belongsToMany(m.Appointment, { through: 'appointment_subservices' });

module.exports = db;