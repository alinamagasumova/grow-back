module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Product', {
        product_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // master_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //     model: Master,
        //     key: 'id_master',
        //     }
        // },
})};