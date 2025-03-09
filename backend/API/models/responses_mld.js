module.exports = (sequelize, DataTypes) => {
    const Response = sequelize.define('Response', {
        responses_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        sender: {
            type: DataTypes.ENUM('User', 'Moodi'),
            allowNull: false
        },
        keyword: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sentiment_score: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        emotion_category: {
            type: DataTypes.ENUM('joy', 'sadness', 'fear', 'anger'),
            allowNull: false
        },
        intensity_score: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
    // Associations
    Response.associate = (models) => {
        Response.belongsTo(models.ChatSession, {
            foreignKey: 'chat_session_ID',
            as: 'session_ID'
        });
    };

    return Response;
};


//ayusin paaa