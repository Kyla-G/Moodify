module.exports = async function syncDatabase(sqliteDB, mysqlDB) {
    try {
        // Ensure MySQL connection
        await mysqlDB.authenticate();
        console.log("✅ MySQL connected successfully");

        // Fetch data from SQLite
        sqliteDB.all("SELECT * FROM Users", async (err, rows) => {
            if (err) {
                console.error("❌ Error fetching from SQLite:", err);
                return;
            }

            if (!rows || rows.length === 0) {
                console.log("⚠️ No data found in SQLite to sync.");
                return;
            }

            // console.log("📥 Retrieved rows from SQLite:"); // Debugging

            for (const row of rows) {
                console.log("");

                if (!row.user_ID || !row.nickname) {
                    console.error("⚠️ Skipping row due to missing data:", row);
                    continue;
                }

                try {
                    await mysqlDB.query(
                        "INSERT INTO Users (user_ID, nickname) VALUES (?, ?) ON DUPLICATE KEY UPDATE nickname = ?",
                        { replacements: [row.user_ID, row.nickname, row.nickname] }
                    );
                } catch (queryError) {
                    console.error("❌ Error inserting row into MySQL:", queryError);
                }
            }

            console.log("✅ Data synchronized from SQLite to MySQL");
        });

    } catch (error) {
        console.error("❌ Sync Error:", error);
    }
};
