const bcrypt = require('bcrypt');
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
      unique: true,
      validate: {
        is: {
          args: /\+7[0-9]{10}/,
          msg: "Phone number should start with +7 and contain 11 numbers"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Not valid email",
        }
      },
      set(mail) {
        this.setDataValue('email', mail.toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(pwd) {
        const salt = bcrypt.genSaltSync();
        const hashed_pwd = bcrypt.hashSync(pwd, salt);
        this.setDataValue('password', hashed_pwd);
      }
    },
    city: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: 'Москва',
    }
}, { onDelete: 'cascade' })};