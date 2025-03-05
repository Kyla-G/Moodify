module.exports = (sequelize, DataTypes) => {
    const XP = sequelize.define('XP', {
        xp_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,  // Set as Primary Key
            autoIncrement: true, // Enable Auto Increment
            allowNull: false
        },
        user_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user_tbl',  // FK references user_tbl
                key: 'user_ID'
            }
        },
        chat_session_ID: {
            type: DataTypes.INTEGER,
            allowNull: true, // Allow null in case XP is not tied to a chat session
            references: {
                model: 'chat_sessions_tbl',
                key: 'chat_session_ID'
            }
        },
        entry_ID: {
            type: DataTypes.INTEGER,
            allowNull: true, // Allow null if not linked to a mood entry
            references: {
                model: 'mood_entries_tbl',
                key: 'entry_ID'
            }
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
    }, {
        tableName: 'xp_table', // Explicit table name
        timestamps: false // Disable createdAt & updatedAt fields
    });

    return XP;
};
