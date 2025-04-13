const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) => {
    const isSQLite = sequelize.options.dialect === 'sqlite'; // Check if using SQLite

    const User = sequelize.define('User', {
        user_ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
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
            defaultValue: isSQLite ? null : sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: isSQLite ? null : sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        }
    }, {
        timestamps: isSQLite, // Enable automatic timestamps only for SQLite
        hooks: {
            beforeCreate: (user) => {
                if (isSQLite) {
                    user.user_ID = nanoid(8); // Use nanoid for SQLite
                    user.createdAt = new Date();
                    user.updatedAt = new Date();
                }
            },
            beforeUpdate: (user) => {
                if (isSQLite) {
                    user.updatedAt = new Date(); // Update manually for SQLite
                }
            }
        }
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
            as: 'feedback',
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
