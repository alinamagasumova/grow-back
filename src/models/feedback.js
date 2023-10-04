module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Feedback', {
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