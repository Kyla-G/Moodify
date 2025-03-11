module.exports = (sequelize, DataTypes) => {
    const MoodEntry = sequelize.define('MoodEntry', {
        entry_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,  // Set as Primary Key
            autoIncrement: true, // Enable Auto Increment
            allowNull: false
        },
        moods: {
            type: DataTypes.ENUM('rad', 'good', 'meh', 'bad', 'awful'),
            allowNull: false
        },

        logged_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        emotions: { //hmmmmmmmm think about this
            type: DataTypes.STRING, // SQLite doesn't support SET, so use a string
            allowNull: false,
            get() {
                return this.getDataValue('emotions') ? this.getDataValue('emotions').split(',') : [];
            },
            set(value) {
                this.setData
            }
        }
    });
    MoodEntry.associate = (models) => {
        MoodEntry.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user'
        });
    };

    return MoodEntry;

}
