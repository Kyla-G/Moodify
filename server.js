const http = require('http');
const app = require('./app'); // Import the app module
const db = require('./API/models'); // Import the database models

const port = 8080;

const server = http.createServer(app);

// Synchronize the database before starting the server
db.sequelize.sync({ alter: false }) // Change `force` to `true` only for development or testing
  .then(() => {
    console.log('MySQL Cloud Database connected and synchronized successfully.');
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect and sync Cloud database:', err);
  });


const sqlite3 = require("sqlite3").verbose();

const db1 = new sqlite3.Database(process.env.DATABASE_PATH, (err) => {
    if (err) {
        console.error("Local Database connection error:", err);
    } else {
        console.log("Connected to SQLite local database");
    }
});
