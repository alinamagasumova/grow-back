module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Subservice', {
    subservice_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subservice_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
