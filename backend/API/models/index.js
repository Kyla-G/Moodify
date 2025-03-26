"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
require("dotenv").config();

// Load database configurations
const config = require("../config/config.json");
const sqliteConfig = config["development"]; // SQLite settings
const mysqlConfig = config["production"];   // MySQL settings

// Initialize Sequelize instances for both databases
const sqliteSequelize = new Sequelize(sqliteConfig);
const mysqlSequelize = new Sequelize(mysqlConfig);

const db = {};

// Load all models and initialize them for both SQLite and MySQL
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const modelDefinition = require(path.join(__dirname, file));

    // Initialize models for both databases
    const sqliteModel = modelDefinition(sqliteSequelize, Sequelize.DataTypes);
    const mysqlModel = modelDefinition(mysqlSequelize, Sequelize.DataTypes);

    // Store models separately for each database
    db[sqliteModel.name] = {
      sqlite: sqliteModel,
      mysql: mysqlModel,
    };
  });

// Function to ensure MySQL tables are created
// db.initializeDatabases = async () => {
//   try {
//     console.log("🔄 Syncing databases...");

//     // Sync SQLite (force false to avoid data loss)
//     await sqliteSequelize.sync();
//     console.log("✅ SQLite tables created.");

//     // Sync MySQL (force false to avoid data loss)
//     await mysqlSequelize.sync();
//     console.log("✅ MySQL tables created.");

//   } catch (error) {
//     console.error("❌ Error syncing databases:", error);
//   }
// };

// // Function to sync new data from SQLite to MySQL
// db.syncWithMySQL = async () => {
//   try {
//     const users = await db.User.sqlite.findAll({
//       raw: true,
//       attributes: { exclude: ["createdAt", "updatedAt"] },
//     });

//     for (const user of users) {
//       const existingUser = await db.User.mysql.findOne({ where: { user_ID: user.user_ID } });

//       if (!existingUser) {
//         await db.Users.mysql.create(user);
//       }
//     }
//     console.log("✅ MySQL sync completed.");
//   } catch (err) {
//     console.error("❌ Error syncing with MySQL:", err);
//   }
// };

// Authenticate both databases
(async () => {
  try {
    await sqliteSequelize.authenticate();
    console.log("✅ Connected to SQLite database.");

    await mysqlSequelize.authenticate();
    console.log("✅ Connected to MySQL database.");

    // Ensure tables exist in both databases
    // await db.initializeDatabases();

  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();

// Store Sequelize instances
db.sqlite = sqliteSequelize;
db.mysql = mysqlSequelize;
db.sequelize = sqliteSequelize; // Keep SQLite as the primary instance
db.Sequelize = Sequelize;

module.exports = db;
