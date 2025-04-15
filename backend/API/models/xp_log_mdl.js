const dayjs = require('dayjs');
const { nanoid } = require('nanoid')

module.exports = (sequelize, DataTypes) => {
    if (sequelize.getDialect() === 'mysql') return null;

    const XPLog = sequelize.define('XPLog', {
        xp_log_ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: true
        },
        user_ID: {  // Explicitly defining the foreign key
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "Users",  // Ensure the correct table name
                key: "user_ID",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },


        action_type: {
            type: DataTypes.ENUM('mood_entry', 'chat_session'),
            allowNull: false
        },
        action_ID_mood: {
            type: DataTypes.STRING,
            allowNull: true,  // Allows null if it's not a mood entry action
            references: {
                model: 'MoodEntries',  // Ensure the correct table name
                key: 'entry_ID',
            },
            onDelete: 'CASCADE',
            onUpdate: "CASCADE",
        },
        // action_ID_chat: {
        //     type: DataTypes.STRING,
        //     allowNull: true,  // Allows null if it's not a chat session action
        //     references: {
        //         model: 'ChatSessions',  // Ensure the correct table name
        //         key: 'session_ID',
        //     },
        //     onDelete: 'CASCADE',
        // },
        
        xp_earned: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        log_date: {
            type: DataTypes.DATE,
            allowNull: true,
            
        },

        streak:{
            type:DataTypes.INTEGER,
            allowNull: true

        }

       
    },

    {
        timelapse:false,
         hooks: {
                    beforeCreate: (user) => {
                        user.user_ID = nanoid(8);
                    }
                }
    }
    
    )


    XPLog.associate = (models) => {
        XPLog.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user',
            onDelete: 'CASCADE'
        });
    }


    return XPLog;
};
