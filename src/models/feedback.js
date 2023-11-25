module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Feedback', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5,
        min: 1,
      },
    },
    feedback_text: {
      type: DataTypes.STRING,
      validate: {
        len: [5, 100],
      },
    },
  });
};
