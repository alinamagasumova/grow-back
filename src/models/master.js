module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Master', {
    job_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
})};