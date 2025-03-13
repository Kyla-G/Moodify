const { nanoid } = require('nanoid');


module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: true
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
        timestamps: false,
        hooks: {
            beforeCreate: (user) => {
                user.user_ID = nanoid(8); // Set nanoid length to 8 FOR SQLITE, FOR MYSQL STRING ONLY DON'T USE NANOID
            }
        }
            
    });

    //timestamps are true for sqlite

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
            as: 'feedback',  // Removed duplicate alias
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
