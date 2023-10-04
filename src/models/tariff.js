module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Tariff', {
        tariff_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        tariff_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
})};