module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Tariff', {
        tariff_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'Нет тарифа'
        },
        tariff_price: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0
        },
})};