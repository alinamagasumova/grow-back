const { PAY_STATUS_VALUES } = require('../../dbConfigs/models_config');
module.exports = async function (sequelize, DataTypes) {
    return Tariff_status = sequelize.define('Tariff_status', {
        tariff_status: {
            type: DataTypes.ENUM,
            values: PAY_STATUS_VALUES,
            allowNull: false,
        },
    });
};