module.exports = (sequelize, DataTypes) => {
    const ChatSession = sequelize.define('ChatSession', {
        chat_session_ID: {
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
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'chat_sessions_tbl',
        timestamps: false
    });

    return ChatSession;
};
