const { nanoid } = require('nanoid')

module.exports = (sequelize, DataTypes) => {
    const XPProgress = sequelize.define('XPProgress', {
        xp_progress_ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: true
        },
        current_xp: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        last_date_updated: {
            type: DataTypes.DATE,
            allowNull: true
        },

        streak:{
            type:DataTypes.INTEGER,
            allowNull:true
        }
    }, {
        timelapse:false,
         hooks: {
                    beforeCreate: (xpProgress) => {
                        xpProgress.xp_progress_ID = nanoid(8);
                    }
                }
    })

    XPProgress.associate = (models) => {
        XPProgress.belongsTo(models.User, {
            foreignKey: 'user_ID',
            as: 'user'
        });
        
    };

    return XPProgress;
};
