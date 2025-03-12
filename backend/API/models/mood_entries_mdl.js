const { ALLOWED_EMOTIONS } = require("../../emotion_values");


module.exports = (sequelize, DataTypes) => {
    const MoodEntry = sequelize.define('MoodEntry', {
        entry_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,  // Set as Primary Key
            autoIncrement: true, // Enable Auto Increment
            allowNull: false
        },
        mood: {
            type: DataTypes.ENUM('rad', 'good', 'meh', 'bad', 'awful'),
            allowNull: false
        },

        logged_date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        
        emotions: {
            type: DataTypes.STRING, // SQLite doesn't support SET, so we use a comma-separated string
            allowNull: false,
            get() {
                return this.getDataValue('emotions') 
                    ? this.getDataValue('emotions').split(',') 
                    : [];
            },
            set(value) {
                if (!Array.isArray(value)) {
                    throw new Error("Emotions must be an array.");
                }
        
                // Validate emotions against the allowed list
                const validEmotions = value.filter(e => ALLOWED_EMOTIONS.has(e));
        
                if (validEmotions.length === 0) {
                    throw new Error("Invalid emotions provided.");
                }
        
                this.setDataValue('emotions', validEmotions.join(','));
            }
        }
    }
)
         //sqlite

      
    MoodEntry.associate = (models) => {
        MoodEntry.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user'
        });
    };

    return MoodEntry;

}
