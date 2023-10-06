module.exports = function (sequelize, DataTypes) { 
  return sequelize.define('Client', {
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: {
        is: /\+7[0-9]{10}/
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
})};