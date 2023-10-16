module.exports = async function (sequelize, DataTypes) {
    return Tariff_status = sequelize.define('Tariff_status', {
        tariff_status: {
            type: DataTypes.ENUM,
            values: process.env.PAY_STATUS_VALUES.split(','),
            allowNull: false,
        },
    });
};