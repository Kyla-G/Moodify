module.exports = (sequelize, DataTypes) => {
    const Response = sequelize.define('Response', {
        responses_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true, 
            allowNull: false
        },
        session_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chat_sessions_tbl',  // FK references chat_sessions_tbl
                key: 'chat_session_ID'
            }
        },
        sender: {
            type: DataTypes.ENUM('User', 'Moodi'),
            allowNull: false
        },
        keyword: {
            type: DataTypes.STRING(255),
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
    }, {
        tableName: 'responses_tbl', // Explicit table name
        timestamps: false // Disable createdAt & updatedAt fields
    });

    return Response;
};
