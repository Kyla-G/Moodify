const http = require('http');
const app = require('./app'); // Import the app module
const db = require('./API/models'); // Import the database models
const port = 8080;
const server = http.createServer(app);
const sqlite3 = require('sqlite3').verbose();
const port1 = process.env.PORT || 3000;
const dbPath = './Moodify.db'; 
const syncDatabase = require('./sync')


// Initialize SQLite database
const db1 = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Failed to connect to SQLite database:', err.message);
        process.exit(1); // Exit the app if database connection fails
    } else {
        console.log('🚀 SQLite database connected successfully.');

        // Run migrations or ensure tables exist (if necessary)
      
                // Start the Express server only if DB is ready
                app.listen(port1, () => {
                    console.log(`Server is listening on port ${port1}`);
                });
            }
        });

        syncDatabase(db1, db.sequelize);
    

//Synchronize the database before starting the server
db.sequelize.sync({ alter: false }) // Change `force` to `true` only for development or testing
  .then(() => {
    console.log('✅ MySQL Cloud Database connected and synchronized successfully.');
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect and sync Cloud database:', err);
  });




    
