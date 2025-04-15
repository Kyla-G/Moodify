const { XPLog, MoodEntry, ChatSession, } = require('../models/'); // Ensure model name matches exported model
const util = require('../../utils');
const { Op } = require("sequelize");
const dayjs = require('dayjs');

const formatDateTime = d => d ? dayjs(d).format('MMM D, YYYY hh:mm A') : 'N/A';

const { nanoid } = require('nanoid');

const createXPLog = async (req, res, next) => {
    try {
        const { user_ID , action_type, action_ID_mood} = req.body;

        if (!util.checkMandatoryFields([user_ID, action_type, action_ID_mood])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        let xp_earned;
        let log_date;

        if (action_type === "mood_entry") {
            const moodEntry = await MoodEntry.findByPk(action_ID_mood);
            if (!moodEntry || moodEntry.user_ID !== user_ID) {
                return res.status(400).json({ successful: false, message: "Invalid mood entry ID." });
            }
            xp_earned = 5;
            log_date = moodEntry.logged_date;
        } else {
            return res.status(400).json({ successful: false, message: "Invalid action type. Must be 'mood_entry'." });
        }

        const startOfDay = dayjs(log_date).startOf("day").toDate();
        const endOfDay = dayjs(log_date).endOf("day").toDate();

        // Check for existing log of the same type on the same day
        const existingSameTypeLog = await XPLog.findOne({
            where: {
                user_ID,
                action_type,
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        if (existingSameTypeLog) {
            return res.status(400).json({
                successful: false,
                message: `You’ve already earned XP for a '${action_type}' today. Only one log per type per day is allowed.`
            });
        }

        // Check for streak logic
        let streak = 0; // Default streak is 0
        const lastMoodEntry = await MoodEntry.findOne({
            where: {
                user_ID,
                logged_date: {
                    [Op.lt]: log_date
                }
            },
            order: [['logged_date', 'DESC']]
        });

        if (lastMoodEntry) {
            const lastEntryDate = dayjs(lastMoodEntry.logged_date);
            const isPreviousDay = dayjs(log_date).isSame(lastEntryDate.add(1, 'day'), 'day');

            if (isPreviousDay) {
                streak = lastMoodEntry.streak + 1; // Increment streak if the user logged yesterday
            }
        } else {
            streak = 1; // If no previous entry, set streak to 1 for the first mood log
        }

        // Create new XP log entry with streak value
        const newLog = await XPLog.create({
            xp_log_ID: nanoid(10),
            user_ID,
            action_type,
            action_ID_mood,
            xp_earned,
            streak // Add streak value here
        });

        return res.status(201).json({
            successful: true,
            message: "XP Log created successfully.",
            data: newLog
        });

    } catch (err) {
        console.error("❌ Error creating XP log:", err);
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};




const getXPLogsByUser = async (req, res) => {
    try {
        const { user_ID } = req.params;

        const xpLogs = await XPLog.findAll({
            where: { user_ID },
            order: [['log_date', 'DESC']]
        });

        if (!xpLogs || xpLogs.length === 0) {
            return res.status(200).json({
                successful: true,
                message: "No XP logs found for this user.",
                count: 0,
                data: []
            });
        }

        return res.status(200).json({
            successful: true,
            message: "XP logs retrieved successfully.",
            count: xpLogs.length,
            data: xpLogs
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
    createXPLog,
    getXPLogsByUser

}
