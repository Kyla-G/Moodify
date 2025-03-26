module.exports = async function syncDatabase(sqliteDB, mysqlDB) {
    try {
        // Ensure MySQL connection
        await mysqlDB.authenticate();
        console.log("✅ MySQL connected successfully");

        // Debugging: Check the MySQL dialect
        console.log(`🔍 MySQL Dialect Detected: ${mysqlDB.options.dialect}`);
        console.log(`🔍 MySQL Connection Config:`, mysqlDB.config);
        

        // Fetch data from SQLite
        const rows = await new Promise((resolve, reject) => {
            sqliteDB.all("SELECT user_ID, nickname, createdAt, updatedAt FROM Users", (err, rows) => {
                if (err) {
                    reject("❌ Error fetching from SQLite: " + err);
                } else {
                    resolve(rows);
                }
            });
        });

        if (!rows || rows.length === 0) {
            console.log("⚠️ No data found in SQLite to sync.");
            return;
        }

        for (const row of rows) {
            try {
                console.log(`🔄 Syncing user ${row.user_ID}: ${row.nickname}`);
                console.log(`🕒 CreatedAt: ${row.createdAt}, UpdatedAt: ${row.updatedAt}`);

                const createdAt = row.createdAt ? new Date(row.createdAt).toISOString() : null;
                const updatedAt = row.updatedAt ? new Date(row.updatedAt).toISOString() : null;

                // ✅ Ensure MySQL is the actual database before running query
                if (mysqlDB.options.dialect === "mysql") {
                    await mysqlDB.query(
                        `INSERT INTO Users (user_ID, nickname, createdAt, updatedAt) 
                        VALUES (?, ?, ?, ?) 
                        ON DUPLICATE KEY UPDATE 
                            nickname = VALUES(nickname),
                            updatedAt = VALUES(updatedAt)`,
                        { replacements: [row.user_ID, row.nickname, createdAt, updatedAt] }
                    );

                    console.log(`✅ Synced user ${row.user_ID}`);
                } else {
                    console.log(`⚠️ Skipping MySQL query because detected dialect is "${mysqlDB.options.dialect}"`);
                }

            } catch (queryError) {
                console.error(`❌ Error inserting user ${row.user_ID}:`, queryError);
            }
        }

        console.log("✅ User data synchronized from SQLite to MySQL");

    } catch (error) {
        console.error("❌ Sync Error:", error);
    }
};
