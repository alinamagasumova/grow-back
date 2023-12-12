module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Appointment', {
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
