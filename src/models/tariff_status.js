module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Tariff_status', {
        tariff_status: {
            type: DataTypes.ENUM,
            values: process.env.PAY_STATUS_VALUES.split(','),
            allowNull: false
        },
})};