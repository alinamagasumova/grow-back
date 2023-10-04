module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Master', {
    job_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // salon_adress: {
    //   type: DataTypes.GEOGRAPHY('POINT'),
    //   allowNull: false
    // },
    salon_longitude: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    salon_latitude: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    salon_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    active_till: {
      type: DataTypes.DATE,
      allowNull: false
    },
    // tariff_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Tariff,
    //     key: 'id_tariff',
    //   }
    // },
    // tariff_status_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Tariff_status,
    //     key: 'id_tariff_status',
    //   }
    // },
})};