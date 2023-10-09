module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Picture', {
        picture: {
            type: DataTypes.BLOB,
            allowNull: false
        },
})};