module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Dop', {
    name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
