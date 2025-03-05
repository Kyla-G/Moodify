'use strict';


const Sequelize = require('sequelize');
const process = require('process');
const path  = require('path');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
  }
); 


const db = {};

module.exports = db;


require('dotenv').config()

// wag muna burahin mga naka comment PLEASE
// const mysql = require('mysql2')

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// const sequelize = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//     port: process.env.DB_PORT,
//   }
// );

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });


//ARROW FUNCTION THAT CHECKS IF THE CONNECTION IS SUCCESSFUL OR NOT.
// const connectDB = () => {

//   const sequelize = new Sequelize(process.env.uri)
//   sequelize.authenticate()
//     .then((result) => {
//       console.log("Successfully connected to db")
//     })
//     .catch((err) => {
//       console.log("Failed connection to db")
//     })
// }


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
