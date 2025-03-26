const { nanoid } = require("nanoid");

module.exports = (sequelize, DataTypes) => {
    const dialect = sequelize.options.dialect; // Get the database dialect
    const isSQLite = dialect === "sqlite"; // Check if using SQLite
    const isMySQL = dialect === "mysql"; // Check if using MySQL

    const User = sequelize.define(
        "User",
        {
            user_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Nickname is required." },
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: isSQLite
                    ? DataTypes.NOW
                    : isMySQL
                    ? sequelize.literal("CURRENT_TIMESTAMP")
                    : null,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: isSQLite
                    ? DataTypes.NOW
                    : isMySQL
                    ? sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
                    : null,
            },
        },
        {
            timestamps: false, // Disable automatic timestamps
            hooks: {
                beforeCreate: (user) => {
                    if (!user.user_ID) {
                        user.user_ID = nanoid(8); // Always use nanoid for ID
                    }
                },
            },
        }
    );

    return User;
};
