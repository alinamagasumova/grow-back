module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Tariff', {
        tariff_name: {
            type: DataTypes.STRING(15),
            allowNull: false,
            defaultValue: 'Нет тарифа'
        },
        tariff_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        tariff_old_price: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0
        },
        photo_limit: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0
        },
        service_limit: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0
        },
        product_limit: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            defaultValue: 0
        },
        dop_config: {
            type: DataTypes.STRING,
            allowNull: false, 
            defaultValue: 'Нет дополнительных покупок'
        },

})};