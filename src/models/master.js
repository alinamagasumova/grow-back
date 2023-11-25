module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Master', {
    job_description: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Описание работы',
    },
    salon_longitude: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    salon_latitude: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0,
    },
    salon_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Название салона',
    },
    active_till: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  });
};
