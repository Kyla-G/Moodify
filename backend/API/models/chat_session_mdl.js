module.exports = (sequelize, DataTypes) => {
    const ChatSession = sequelize.define('ChatSession', {
        chat_session_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }
)
        ChatSession.associate = (models) => {
            ChatSession.belongsTo(models.User, {
                foreignKey: 'user_ID',
                as: 'user'
            });
    } 
    
    return ChatSession;
    
};
