const { User, XPProgress, XPLog } = require('../models/'); // Ensure model name matches exported model
const { Op } = require("sequelize");
const util = require('../../utils');
const dayjs = require("dayjs");

const createXPProgress = async (req, res) => {
    try {
        const { user_ID } = req.body;

        if (!user_ID) {
            return res.status(400).json({
                successful: false,
                message: "user_ID is required."
            });
        }

        // Fetch the user to get the createdAt timestamp
        const user = await User.findByPk(user_ID);

        if (!user) {
            return res.status(404).json({
                successful: false,
                message: "User not found."
            });
        }

        const gained_xp_date = user.createdAt;

        // Create the XPProgress entry with preset values
        const newXPProgress = await XPProgress.create({
            user_ID,
            gained_xp: 0,
            gained_xp_date,
            streak: 0
        });

        return res.status(201).json({
            successful: true,
            message: "XP Progress initialized successfully.",
            data: newXPProgress
        });

    } catch (err) {
        console.error("❌ Error creating XPProgress:", err);
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};

const getProgress = async (req, res) => {
    try {
        const { user_ID } = req.params;

        const progressLogs = await XPProgress.findAll({
            where: { user_ID },
            order: [['gained_xp_date', 'DESC']]
        });

        if (!progressLogs || progressLogs.length === 0) {
            return res.status(200).json({
                successful: true,
                message: "No XP progress found for this user.",
                count: 0,
                data: []
            });
        }

        return res.status(200).json({
            successful: true,
            message: "Retrieved XP progress successfully.",
            count: progressLogs.length,
            data: progressLogs
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};

module.exports = {
    createXPProgress,
    // updateXPProgress,
    getProgress
};
