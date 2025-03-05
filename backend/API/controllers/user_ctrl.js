
const { User } = require('../models/'); // Ensure model name matches exported model
const util = require('../../utils');
const { Op } = require("sequelize");




const addUser = async (req, res, next) => {
    const t = await User.sequelize.transaction(); // Start transaction

    try {
        const { nickname } = req.body;
        

        // Validate mandatory fields
        if (!util.checkMandatoryFields([nickname,])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        // add validation for nickname format

        // Create new user with a hashed password
        const newUser = await User.create(
            {
                nickname
            },
            { transaction: t }
        );

        await t.commit(); // Commit transaction

        return res.status(201).json({
            successful: true,
            message: "Successfully added new user.",
            user: { user_ID: newUser.id, nickname: newUser.nickname } // Returning basic details
        });

    } catch (err) {
        await t.rollback(); // Rollback transaction on error
        console.error("Error in addUser:", err);

        return res.status(500).json({
            successful: false,
            message: err.message || "An unexpected error occurred."
        });
    }
};


const updateUserById = async (req, res, next) => {
    try {
        const { nickname } = req.body;

        // Check if the user exists
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({
                successful: false,
                message: "User not found."
            });
        }

        // Validate mandatory fields
        if (!util.checkMandatoryFields([nickname])) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }
        // Update user data
        await user.update({
           nickname
        });

        return res.status(200).json({
            successful: true,
            message: "User updated successfully."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            successful: false,
            message: err
        });
    }
};

const getUserById = async (req, res, next) => {
    try {
        // Find user by primary key (id) using Sequelize
        const user = await User.findByPk(req.params.id);

        if (!user) {
            res.status(404).send({
                successful: false,
                message: "User not found"
            });
        }
        else {
            res.status(200).send({
                successful: true,
                message: "Retrieved user.",
                data: user
            });
        }
    } catch (err) {
        res.status(500).send({
            successful: false,
            message: err.message
        });
    }
};



const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();

        if (!users || users.length === 0) {
            return res.status(200).json({
                successful: true,
                message: "No user found.",
                count: 0,
                data: [],
            });
        }

        res.status(200).send({
            successful: true,
            message: "Retrieved all users.",
            data: users
        });

    } catch (err) {
        res.status(500).send({
            successful: false,
            message: err.message
        });
    }
}

module.exports = {
    addUser,
    getUserById,
    getAllUsers,
    updateUserById
}