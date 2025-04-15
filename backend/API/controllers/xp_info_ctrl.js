const { XPInfo } = require('../models/'); // Ensure model name matches exported model
const util = require('../../utils');
const { Op } = require("sequelize");
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const addXPInfo = async (req, res) => {
    try {
        const { user_ID, xp_feature, is_unlocked } = req.body;

        // Validate mandatory fields
        if (!user_ID || !xp_feature) {
            return res.status(400).json({
                successful: false,
                message: 'Missing required fields: user_ID, xp_feature.'
            });
        }

        // Predefined XP values
        const xpValues = {
            'theme 1': 25,
            'theme 2': 50,
            'theme 3': 75
        };

        // Validate and get xp_value_feature
        if (!xpValues[xp_feature]) {
            return res.status(400).json({
                successful: false,
                message: `Invalid xp_feature. Must be one of: ${Object.keys(xpValues).join(', ')}.`
            });
        }

        const xp_value_feature = xpValues[xp_feature];

        // Create XP Info
        const newXP = await XPInfo.create({
            user_ID,
            xp_feature,
            xp_value_feature,
            is_unlocked: is_unlocked || false
        });

        return res.status(201).json({
            successful: true,
            message: 'XP feature info added successfully.',
            xpInfo: newXP
        });

    } catch (error) {
        console.error("❌ Error adding XPInfo:", error);
        return res.status(500).json({
            successful: false,
            message: 'Internal server error.',
            error: error.message
        });
    }
};


const getXPInfo = async (req, res) => {
    try {
        const { user_ID } = req.query;

        let xpInfoList;

        if (user_ID) {
            // Fetch XPInfo by specific user
            xpInfoList = await XPInfo.findAll({
                where: { user_ID }
            });

            if (xpInfoList.length === 0) {
                return res.status(404).json({
                    successful: false,
                    message: `No XPInfo found for user_ID: ${user_ID}`
                });
            }
        } else {
            // Fetch all XPInfo records
            xpInfoList = await XPInfo.findAll();
        }

        return res.status(200).json({
            successful: true,
            data: xpInfoList
        });

    } catch (error) {
        console.error("❌ Error fetching XPInfo:", error);
        return res.status(500).json({
            successful: false,
            message: 'Internal server error.',
            error: error.message
        });
    }
};



module.exports = {
    addXPInfo,
    getXPInfo 
};
