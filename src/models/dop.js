module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Dop', {
    dop_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    dop_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dop_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
