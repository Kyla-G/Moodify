module.exports = (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        feedback_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user_tbl',
                key: 'user_ID'
            }
        },
        chat_session_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chat_sessions_tbl',
                key: 'chat_session_ID'
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        feedback_time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'feedback_tbl',
        timestamps: false
    });

    return Feedback;
};
