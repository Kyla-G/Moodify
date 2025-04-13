const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const Response = sequelize.define('Response', {
        responses_ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: true
        },
        sender: {
            type: DataTypes.ENUM('User', 'Moodi'),
            allowNull: false
        },
        message: {
            type:DataTypes.STRING,
            allowNull:false
        
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
    },
        {
            timelapse:false,
             hooks: {
                        beforeCreate: (xpProgress) => {
                            xpProgress.xp_progress_ID = nanoid(8);
                        }
                    }
        })
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