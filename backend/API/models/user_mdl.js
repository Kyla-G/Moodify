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
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Date is required." }
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Date is required." }
            }
        }
    }, {  
        timestamps: false
    });

    // Define Associations AFTER model definition
    User.associate = (models) => {
        User.hasMany(models.MoodEntry, {
            foreignKey: 'user_ID',
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
            as: 'userFeedback',  // Removed duplicate alias
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        User.hasMany(models.XPInfo, {
            foreignKey: 'user_ID',
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
    };

    return User;
};
