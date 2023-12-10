module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Photo', {
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
