module.exports = (sequelize, DataTypes) => {
    const  XPInfo = sequelize.define('XP', {
        xp_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,  
            autoIncrement: true, 
            allowNull: false
        },
        xp_feature: {
            type: DataTypes.ENUM(
                'palette 1', 'palette 2', 'palette 3', 
                'emoji set 1', 'emoji set 2', 'emoji set 3', 
                'moodi accessories'
            ),
            allowNull: false
        },
        xp_value_feature: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gained_xp: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    // Ensure that XP.associate is inside the module.exports function
    XPInfo.associate = (models) => {
        XPInfo.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user'
        });
    };

    return XPInfo;
};
