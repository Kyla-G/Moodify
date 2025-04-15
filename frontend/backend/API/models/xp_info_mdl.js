module.exports = (sequelize, DataTypes) => {
    if (sequelize.getDialect() === 'mysql') return null;

    const XPInfo = sequelize.define('XPInfo', {
        xp_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        user_ID: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "Users",
                key: "user_ID",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        xp_feature: {
            type: DataTypes.ENUM(
                'theme 1',
                'theme 2',
                'theme 3'
            ),
            allowNull: false
        },

        xp_value_feature: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        is_unlocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: false
    });

    XPInfo.associate = (models) => {
        XPInfo.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user'
        });
    };

    return XPInfo;
};
