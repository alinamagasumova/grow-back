module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Submaster', {
    job_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
