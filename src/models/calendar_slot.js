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