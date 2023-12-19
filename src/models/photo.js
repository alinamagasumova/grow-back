module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Photo', {
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
