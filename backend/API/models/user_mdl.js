module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,  
            autoIncrement: true, 
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Nickname is required." }
            }
        }
    });

    // Define Associations AFTER model definition
    User.associate = (models) => {
        User.hasMany(models.MoodEntry, {
            foreignKey: 'user_ID',  // Fixed foreignKey name
            as: 'moodEntries',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.XPProgress, {
            foreignKey: 'user_ID',
            as: 'xpProgress',
            onDelete: 'SET NULL', 
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.Feedback, {
            foreignKey: 'user_ID',
            as: 'Feedback',
            onDelete: 'SET NULL', 
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.XPInfo, {
            foreignKey: 'user_ID',  // Ensure consistency with previous keys
            as: 'xpTbl',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.ChatSession, {
            foreignKey: 'user_ID',
            as: 'chatSession',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.Feedback, {
            foreignKey: 'user_ID',
            as: 'userFeedback',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });
    };

    return User;
};
