"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config();

// Load database configurations
const config = require("../config/config.json");
// const User = require("../backend/API/models");



// Ensure both database configurations exist
const sqliteConfig = config["development"]; // SQLite settings
const mysqlConfig = config["production"];   // MySQL settings

if (!sqliteConfig || !sqliteConfig.dialect) {
  throw new Error("❌ SQLite config is missing or incorrect.");
}
if (!mysqlConfig || !mysqlConfig.dialect) {
  throw new Error("❌ MySQL config is missing or incorrect.");
}

// Initialize Sequelize instances for both databases
const sqliteSequelize = new Sequelize({
  dialect: sqliteConfig.dialect,
  storage: sqliteConfig.storage
});

const mysqlSequelize = new Sequelize(
  mysqlConfig.database,
  mysqlConfig.username,
  mysqlConfig.password,
  {
    host: mysqlConfig.host ,
    dialect: mysqlConfig.dialect,
    port: mysqlConfig.port,
    logging: console.log
  }
);

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

// Authenticate both databases
(async () => {
  try {

    await mysqlSequelize.sync({ alter: false });
    console.log("✅ MySQL connected.");

  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();


// Store Sequelize instances
db.sqlite = sqliteSequelize;
db.mysql = mysqlSequelize;
db.sequelize = sqliteSequelize; // Default to SQLite
db.Sequelize = Sequelize;

module.exports = db;
