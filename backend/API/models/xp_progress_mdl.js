module.exports = (sequelize, DataTypes) => {
    const XPProgress = sequelize.define('XPProgress', {
        xp_progress_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
        timestamps: true
    });

    XPProgress.associate = (models) => {
        XPProgress.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user'
        });
    };

    return XPProgress;
};
