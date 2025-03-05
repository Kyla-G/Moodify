module.exports = (sequelize, DataTypes) => {
    const XPProgress = sequelize.define('XPProgress', {
        xp_progress_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user_tbl',
                key: 'user_ID'
            }
        },
        gained_xp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gained_xp_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'xp_progress',
        timestamps: false
    });

    return XPProgress;
};
