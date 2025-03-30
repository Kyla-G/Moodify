const { ALLOWED_EMOTIONS } = require("../../emotion_values");
const { nanoid } = require("nanoid");

module.exports = (sequelize, DataTypes) => {
    const dialect = sequelize.options.dialect;
    const isSQLite = dialect === "sqlite";
    const isMySQL = dialect === "mysql";

    const MoodEntry = sequelize.define(
        "MoodEntry",
        {
            entry_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false, // Ensure it's required
                defaultValue: () => nanoid(8), // Generates ID automatically
            },
            mood: {
                type: DataTypes.ENUM("rad", "good", "meh", "bad", "awful"),
                allowNull: false,
            },
            logged_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            emotions: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    return this.getDataValue("emotions")
                        ? this.getDataValue("emotions").split(",")
                        : [];
                },
                set(value) {
                    if (!Array.isArray(value)) {
                        throw new Error("Emotions must be an array.");
                    }
                    const validEmotions = value.filter((e) => ALLOWED_EMOTIONS.has(e));
                    if (validEmotions.length === 0) {
                        throw new Error("Invalid emotions provided.");
                    }
                    this.setDataValue("emotions", validEmotions.join(","));
                },
            },
            ...(isSQLite && {
                journal: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            }),
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: isSQLite ? new Date() : sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: isSQLite ? new Date() : sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
            },
        },
        {
            timestamps: false, // Keeping this false since timestamps are manually handled
        }
    );

    // Ensure associations are registered
    MoodEntry.associate = (models) => {
        MoodEntry.belongsTo(models.User, {
            foreignKey: "user_ID",
            as: "user",
            onDelete: "CASCADE",
        });
    };

    return MoodEntry;
};
