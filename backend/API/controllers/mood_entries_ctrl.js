const { MoodEntry } = require('../models/'); // Ensure model name matches exported model
const util = require('../../utils');
const { Op } = require("sequelize");

// Add Mood Only
const addMood = async (req, res, next) => {
    const t = await MoodEntry.sequelize.transaction(); // Start transaction

    try {
        const { user_ID, moods, logged_date } = req.body;

        // Validate mandatory fields
        if (!util.checkMandatoryFields([user_ID, moods, logged_date])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        // Create new mood entry
        const newMoodEntry = await MoodEntry.create(
            {
                user_ID,
                moods,
                logged_date
            },
            { transaction: t }
        );

        await t.commit(); // Commit transaction

        return res.status(201).json({
            successful: true,
            message: "Successfully added new mood.",
            moodEntry: { entry_ID: newMoodEntry.entry_ID, user_ID: newMoodEntry.user_ID, moods: newMoodEntry.moods }
        });

    } catch (err) {
        await t.rollback(); // Rollback transaction on error
        console.error("Error in addMood:", err);

        return res.status(500).json({
            successful: false,
            message: err.message || "An unexpected error occurred."
        });
    }
};

// Add Emotion Only
const addEmotion = async (req, res, next) => {
    const t = await MoodEntry.sequelize.transaction(); // Start transaction

    try {
        const { user_ID, emotions, logged_date } = req.body;

        // Validate mandatory fields
        if (!util.checkMandatoryFields([user_ID, emotions, logged_date])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        // Check if a mood entry exists for the given user and date
        const existingMoodEntry = await MoodEntry.findOne({
            where: {
                user_ID,
                logged_date
            }
        });

        if (!existingMoodEntry) {
            return res.status(400).json({
                successful: false,
                message: "An emotion cannot be recorded without a mood entry."
            });
        }

        // Add the emotion to the existing mood entry
        await existingMoodEntry.update({ emotions }, { transaction: t });

        await t.commit(); // Commit transaction

        return res.status(201).json({
            successful: true,
            message: "Successfully added emotion to the existing mood entry.",
            emotionEntry: { entry_ID: existingMoodEntry.entry_ID, user_ID: existingMoodEntry.user_ID, emotions: existingMoodEntry.emotions }
        });

    } catch (err) {
        await t.rollback(); // Rollback transaction on error
        console.error("Error in addEmotion:", err);

        return res.status(500).json({
            successful: false,
            message: err.message || "An unexpected error occurred."
        });
    }
};


const updateMoodEntryById = async (req, res, next) => {
    try {
        const { moods, emotions, logged_date } = req.body;

        // Check if the mood entry exists
        const moodEntry = await MoodEntry.findByPk(req.params.id);
        if (!moodEntry) {
            return res.status(404).json({
                successful: false,
                message: "Mood entry not found."
            });
        }

        // Validate mandatory fields
        if (!util.checkMandatoryFields([moods, emotions, logged_date])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        // Update mood entry data
        await moodEntry.update({
            moods,
            emotions,
            logged_date
        });

        return res.status(200).json({
            successful: true,
            message: "Mood entry updated successfully."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};

const getMoodEntryById = async (req, res, next) => {
    try {
        // Find mood entry by primary key (id) using Sequelize
        const moodEntry = await MoodEntry.findByPk(req.params.id);

        if (!moodEntry) {
            return res.status(404).json({
                successful: false,
                message: "Mood entry not found"
            });
        }

        return res.status(200).json({
            successful: true,
            message: "Retrieved mood entry.",
            data: moodEntry
        });

    } catch (err) {
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};

const getAllMoodEntries = async (req, res, next) => {
    try {
        const moodEntries = await MoodEntry.findAll();

        if (!moodEntries || moodEntries.length === 0) {
            return res.status(200).json({
                successful: true,
                message: "No mood entries found.",
                count: 0,
                data: []
            });
        }

        return res.status(200).json({
            successful: true,
            message: "Retrieved all mood entries.",
            data: moodEntries
        });

    } catch (err) {
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};

module.exports = {
    addMood,
    addEmotion,
    getMoodEntryById,
    getAllMoodEntries,
    updateMoodEntryById
};
