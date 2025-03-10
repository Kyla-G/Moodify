module.exports = (sequelize, DataTypes) => {
    const XpLog = sequelize.define('XpLog', {
        xp_log_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        action_type: {
            type: DataTypes.ENUM('mood_entry', 'chat_session'),
            allowNull: false
        },
        action_ID: {
            type: DataTypes.INTEGER,
            allowNull: false // Stores either mood_entry_ID or chat_session_ID
        },
        xp_earned: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }

       
    },
    
    )


    XpLog.associate = (models) => {
        XpLog.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user',
            onDelete: 'CASCADE'
        });
    };

    return XpLog;
};
