module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Picture', {
        picture: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        // master_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     references: {
        //     model: Master,
        //     key: 'id_master',
        //     }
        // },
})};