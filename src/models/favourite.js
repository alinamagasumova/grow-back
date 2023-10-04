module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Favourite', {
    // client_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Client,
    //     key: 'id_client',
    //   }
    // },
    // master_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Master,
    //     key: 'id_master',
    //   }
    // },
})};