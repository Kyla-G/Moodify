const { ALLOWED_EMOTIONS } = require("../../emotion_values");
const { nanoid } = require("nanoid");

module.exports = (sequelize, DataTypes) => {
  if (sequelize.getDialect() === 'mysql') return null;

  const MoodEntry = sequelize.define(
    "MoodEntry",
    {
      entry_ID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: () => nanoid(8),
      },
      user_ID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_ID",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
          return this.getDataValue("emotions")?.split(",") || [];
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
      journal: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  // Association
  MoodEntry.associate = (models) => {
    MoodEntry.belongsTo(models.User, {
      foreignKey: "user_ID",
      as: "user",
    });

    // Uncomment if XPLog is used later:
    // MoodEntry.hasMany(models.XPLog, {
    //   foreignKey: "entry_ID",
    //   as: "xpLogs",
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // });
  };

  return MoodEntry;
};
