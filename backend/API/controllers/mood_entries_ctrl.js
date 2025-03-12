const { MoodEntry } = require('../models/'); // Ensure model name matches exported model
const util = require('../../utils');
const { Op } = require("sequelize");
const { ALLOWED_EMOTIONS} = require('../../emotion_values');

// Add Mood Only
const addMoodEntry = async (req, res, next) => {
    try {
        const { user_ID, mood, emotions, logged_date } = req.body;

        // Validate mandatory fields
        if (!util.checkMandatoryFields([user_ID, mood, emotions, logged_date])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        // Convert logged_date to a Date object and remove time part
        const providedDate = new Date(logged_date);
        providedDate.setHours(0, 0, 0, 0);

        // Get today's date and remove time part
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Prevent logging a mood for a future date
        if (providedDate > today) {
            return res.status(400).json({
                successful: false,
                message: "You cannot log a mood for a future date."
            });
        }

        // Create new mood entry
        const newMoodEntry = await MoodEntry.create({
            user_ID,
            mood,
            emotions, //limit to 3 emotions only
            logged_date
        });

        return res.status(201).json({
            successful: true,
            message: "Successfully added new mood.",
            moodEntry: { 
                entry_ID: newMoodEntry.entry_ID, 
                user_ID: newMoodEntry.user_ID, 
                mood: newMoodEntry.mood, 
                emotions: newMoodEntry.emotions 
            }
        });

    } catch (err) {
        console.error("Error in adding a mood:", err);
        return res.status(500).json({
            successful: false,
            message: err.message || "An unexpected error occurred."
        });
    }
};



const getAllEntries = async (req, res, next) => {
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

const getEntriesById = async (req, res, next) => {
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
            message: "Retrieved all mood entries of single user.",
            data: moodEntries
        });

    } catch (err) {
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};

const updateEntryById = async (req, res, next) => {
    try {
        const { mood, emotions, logged_date } = req.body;

        // Check if the mood entry exists
        const moodEntry = await MoodEntry.findByPk(req.params.id);
        if (!moodEntry) {
            return res.status(404).json({
                successful: false,
                message: "Mood entry not found."
            });
        }

        // Prepare the update data (only include fields that exist in req.body)
        const updateData = {};
        if (mood !== undefined) updateData.mood = mood;
        if (emotions !== undefined) updateData.emotions = emotions;
        if (logged_date !== undefined) {
            // Prevent updating to a future date
            const providedDate = new Date(logged_date);
            providedDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (providedDate > today) {
                return res.status(400).json({
                    successful: false,
                    message: "You cannot update the mood entry to a future date."
                });
            }
            updateData.logged_date = logged_date;
        }

        // Check if there's something to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                successful: false,
                message: "No valid fields provided for update."
            });
        }

        // Update the mood entry
        await moodEntry.update(updateData);

        return res.status(200).json({
            successful: true,
            message: "Mood entry updated successfully.",
            updatedFields: updateData
        });

    } catch (err) {
        console.error("Error in updateEntryById:", err);
        return res.status(500).json({
            successful: false,
            message: err.message || "An unexpected error occurred."
        });
    }
};


// const updateEmotionbyId = async (req, res, next) => {
//     try {
//         const { emotions } = req.body;

//         // Check if the mood entry exists
//         const moodEntry = await MoodEntry.findByPk(req.params.id);
//         if (!moodEntry) {
//             return res.status(404).json({
//                 successful: false,
//                 message: "Mood entry not found."
//             });
//         }

//         // Validate mandatory fields
//         if (!util.checkMandatoryFields([emotions])) {
//             return res.status(400).json({
//                 successful: false,
//                 message: "A mandatory field is missing."
//             });
//         }

//         // Update mood entry data
//         await moodEntry.update({
//             emotions,
//         });

//         return res.status(200).json({
//             successful: true,
//             message: "Mood entry updated successfully."
//         });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             successful: false,
//             message: err.message
//         });
//     }
// };



const deleteMoodEntry = async (req, res) => {
    try {
        const entryId = req.params.id;

        const moodEntry = await MoodEntry.findByPk(entryId);

        if (!moodEntry) {
            return res.status(404).json({
                successful: false,
                message: "Mood entry not found.",
            });
        }

        await moodEntry.destroy();

        return res.status(200).json({
            successful: true,
            message: `Mood entry with ID ${entryId} has been deleted.`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            successful: false,
            message: `Error deleting mood entry: ${error.message}`,
        });
    }
};


module.exports = {
    addMoodEntry,
    // addEmotion,
    getEntriesById,
    getAllEntries,
    updateEntryById,
    // updateEmotionbyId,
    deleteMoodEntry
};
