module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Calendar_slot', {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                presentDate(value) {
                  if (new Date(value) < new Date().setHours(0)) {
                    console.log(new Date(value), new Date());
                    throw new Error("invalid date");
                  }
                },
            },
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                presentTime(value) {
                  if (value < new Date().toLocaleTimeString()) {
                    throw new Error("invalid date");
                  }
                },
            },
        },
        busy: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
})};