module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Feedback', {
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5,            
        min: 1,
      }
    },
    feedback_description: {
      type: DataTypes.STRING,
      validate: {
        len: [5, 100]
      }
    },
})}; 