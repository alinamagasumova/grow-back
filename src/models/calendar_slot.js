module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Calendar_slot', {
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        busy: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
})};