module.exports = (sequelize, DataTypes) => {
    const XpLog = sequelize.define('xp_log_tbl', {
        xp_log_ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // Use the table name in references, not the model variable
            references: {
                model: 'User', // or whatever your users table name is
                key: 'user_ID'
            }
        },
        chat_session_ID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'chat_session_tbl', // or whatever your chat sessions table name is
                key: 'session_ID'
            }
        },
        entry_ID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'mood_entry_tbl', // or whatever your mood entries table name is
                key: 'session_ID'
            }
        },
        xp_earned: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        earned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'xp_log_tbl',
        timestamps: false
    });

    // Define associations in the associate method instead
    XpLog.associate = (models) => {
        XpLog.belongsTo(models.User, {
            foreignKey: 'user_ID'
        });
        
        XpLog.belongsTo(models.ChatSession, {
            foreignKey: 'chat_session_ID'
        });
        
        XpLog.belongsTo(models.MoodEntry, {
            foreignKey: 'entry_ID'
        });
    };

    return XpLog;
};