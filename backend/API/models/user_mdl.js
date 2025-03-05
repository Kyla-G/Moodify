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
        }
    }, {
       
    });

    return User;
};
