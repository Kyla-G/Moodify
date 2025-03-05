module.exports = (sequelize, DataTypes) => {
    const MoodEntry = sequelize.define('MoodEntry', {
        entry_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,  // Set as Primary Key
            autoIncrement: true, // Enable Auto Increment
            allowNull: false
        },
        user_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user_tbl',  // FK references user_tbl
                key: 'user_ID'
            }
        },
        moods: {
            type: DataTypes.ENUM('rad', 'good', 'meh', 'bad', 'awful'),
            allowNull: false
        },
        emotions: {
            type: DataTypes.STRING, // SQLite doesn't support SET, so use a string
            allowNull: false,
            get() {
                return this.getDataValue('emotions') ? this.getDataValue('emotions').split(',') : [];
            },
            set(value) {
                this.setData
            }
        }
    }
)
}
