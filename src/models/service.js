module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Service', {
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
