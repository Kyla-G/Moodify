module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "Username is required." }
            }
        }
    }
)
}
