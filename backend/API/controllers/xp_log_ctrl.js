const { XpLog} = require('../models/'); // Ensure model name matches exported model
const util = require('../../utils');
const { Op } = require("sequelize");
const dayjs = require('dayjs');

const formatDateTime = d => d ? dayjs(d).format('MMM D, YYYY hh:mm A') : 'N/A';

const createXPLog = async (req, res, next) => {
    try {
        const { user_ID, action_type, action_ID, xp_earned } = req.body;

        if (!util.checkMandatoryFields([user_ID, action_type, action_ID, xp_earned])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        const newLog = await XPLog.create({
            xp_log_ID: nanoid(10),
            user_ID,
            action_type,
            action_ID,
            xp_earned
        });

        return res.status(201).json({
            successful: true,
            message: "XP Log created successfully.",
            data: newLog
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            successful: false,
            message: err.message
        });
    }
};




modules.export = {
    createXPLog

}
