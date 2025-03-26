
// const {User } = require('../models'); // Adjust path to your models directory
// // const util = require('../../utils');
// // const { Op } = require("sequelize");


// const addUser = async (req, res, next) => {
//     try {
//         const { nickname } = req.body;
        

//         // Validate mandatory fields
//         if (!util.checkMandatoryFields([nickname,])) {
//             return res.status(400).json({
//                 successful: false,
//                 message: "A mandatory field is missing."
//             });
//         }

//         // add validation for nickname format

//         // Create new user with a hashed password
//         const newUser = await User.create(
//             {
//                 nickname,
//                 createdAt, 
//                 updatedAt
//             });
            
        


//         return res.status(201).json({
//             successful: true,
//             message: "Successfully added new user.",
//             user: { user_ID: newUser.id, nickname: newUser.nickname } // Returning basic details
//         });

//     } catch (err) {
//         console.error("Error in adding a user:", err);

//         return res.status(500).json({
//             successful: false,
//             message: err.message || "An unexpected error occurred."
//         });
//     }
// };

const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');

const db = new sqlite3.Database ('Moodify.db');

const addUser = async (req, res) => {
    try {
        const { nickname } = req.body;

        // Validate mandatory fields
        if (!nickname) {
            return res.status(400).json({
                successful: false,
                message: "A mandatory field is missing."
            });
        }

        const userId = nanoid(8); // Generate unique user_ID
        const createdAt = new Date().toISOString(); // Get current timestamp
        const updatedAt = createdAt; // Set updatedAt to same value as createdAt

        // Insert user into SQLite
        db.run(
            `INSERT INTO Users (user_ID, nickname, createdAt, updatedAt) VALUES (?, ?, ?, ?)`,
            [userId, nickname, createdAt, updatedAt],
            function (err) {
                if (err) {
                    console.error("❌ Error adding user:", err.message);
                    return res.status(500).json({
                        successful: false,
                        message: "Database error: " + err.message
                    });
                }

                // Return successful response
                return res.status(201).json({
                    successful: true,
                    message: "Successfully added new user.",
                    user: { user_ID: userId, nickname }
                });
            }
        );
    } catch (err) {
        console.error("❌ Error in adding a user:", err);
        return res.status(500).json({
            successful: false,
            message: err.message || "An unexpected error occurred."
        });
    }
};

// Close database connection when done (optional, if running once)



// const getUserById = async (req, res, next) => {
//     try {
//         // Find user by primary key (id) using Sequelize
//         const user = await User.findByPk(req.params.id);

//         if (!user) {
//             res.status(404).send({
//                 successful: false,
//                 message: "User not found"
//             });
//         }
//         else {
//             res.status(200).send({
//                 successful: true,
//                 message: "Retrieved user.",
//                 data: user
//             });
//         }
//     } catch (err) {
//         res.status(500).send({
//             successful: false,
//             message: err.message
//         });
//     }
// };



const getAllUsers = async (req, res, next) => {

    // console.log("=== getAllUsers method called ===");
    // console.log("DB object keys:", Object.keys(db));
    // console.log("DB User model:", db.User);

  
    try {
        const users = await users.findAll();

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

// const updateUserById = async (req, res, next) => {
//     try {
//         const { nickname } = req.body;

//         // Check if the user exists
//         const user = await User.findByPk(req.params.id);
//         if (!user) {
//             return res.status(404).json({
//                 successful: false,
//                 message: "User not found."
//             });
//         }

//         // Validate mandatory fields
//         if (!util.checkMandatoryFields([nickname])) {
//             return res.status(400).json({
//                 successful: false,
//                 message: "A mandatory field is missing."
//             });
//         }
//         // Update user data
//         await user.update({
//            nickname
//         });

//         return res.status(200).json({
//             successful: true,
//             message: "User updated successfully.",
//             data: " Updated Nickname: " + nickname
//         });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             successful: false,
//             message: err
//         });
//     }
// }

// const deleteUser = async (req, res) => {

//     try {
//         const userId = req.params.id;

//         const user = await User.findByPk(userId);

//         if (!user) {
//             return res.status(404).json({
//                 successful: false,
//                 message: "User not found.",
//             });
//         }

//         await user.destroy();

//         return res.status(200).json({
//             successful: true,
//             message: `User with ID ${userId} has been deleted.`,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             successful: false,
//             message: `Error deleting user: ${error}`,
//         });
//     }
// };

// module.exports = {
//     addUser,
//     getUserById,
//     getAllUsers,
//     updateUserById,
//     deleteUser
// }


// const { nanoid } = require('nanoid');
// const { User, syncWithMySQL } = require('../models'); // Import the User model

// // Controller Function
// const addUser = async (req, res) => {
//     try {
//         const { nickname } = req.body;

//         if (!nickname) {
//             return res.status(400).json({
//                 successful: false,
//                 message: "Nickname is required.",
//             });
//         }

//         // Create user in SQLite using Sequelize
//         const newUser = await User.create({
//             user_ID: nanoid(8),  // Generate nanoid for SQLite
//             nickname,
//             createdAt: new Date(),  // Set timestamps manually
//             updatedAt: new Date()
//         });

//         return res.status(201).json({
//             successful: true,
//             message: "Successfully added new user.",
//             user: { user_ID: newUser.user_ID, nickname: newUser.nickname },
//         });

//     } catch (err) {
//         console.error("Error in adding a user:", err);
//         return res.status(500).json({
//             successful: false,
//             message: err.message || "An unexpected error occurred.",
//         });
//     }
// };



// // Controller Function
// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.findAll({ attributes: ['user_ID', 'nickname', 'createdAt', 'updatedAt'] });

//         return res.status(200).json({
//             successful: true,
//             message: "Fetched all users successfully.",
//             users
//         });

//     } catch (err) {
//         console.error("Error fetching users:", err);
//         return res.status(500).json({
//             successful: false,
//             message: err.message || "An unexpected error occurred.",
//         });
//     }
// };

module.exports = {
getAllUsers,
addUser};






