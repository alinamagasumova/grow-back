module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Service', {
    service_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // master_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Master,
    //     key: 'id_master',
    //   }
    // },
})};