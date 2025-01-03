// import { syncOutToServer } from "./syncdata";

// // immediately deprecated
// // holy sh*t this was a bad idea.
// // this has already become unmanageable and stupid.
// // talk about terrible ideas...
// const initializeSQLiteDb = async () => {
//     const SQLite = await import("expo-sqlite");
//     const db = await SQLite.openDatabaseAsync("gains.db");
//     console.log(db);
//     const createTables = await db.execAsync(`
//         CREATE TABLE IF NOT EXISTS musclegroup
//         (
//             musclegroupid INTEGER PRIMARY KEY AUTOINCREMENT,
//             musclegroupname TEXT NOT NULL
//         );
//         CREATE TABLE IF NOT EXISTS exercise
//         (
//             exerciseid INTEGER PRIMARY KEY AUTOINCREMENT,
//             musclegroupid INTEGER NOT NULL,
//             exercisename TEXT NOT NULL,
//             notes TEXT NOT NULL,
//             dateadded TEXT NOT NULL,
//             dateupdated TEXT,
//             FOREIGN KEY (musclegroupid) REFERENCES musclegroup(musclegroupid)
//         );
//         CREATE TABLE IF NOT EXISTS dummy
//         (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             info TEXT NOT NULL
//         );

//         `);
//     const musclegroupSetup = await db.runAsync(
//         `INSERT OR IGNORE INTO musclegroup(musclegroupid, musclegroupname) VALUES (?, ?)`,
//         1,
//         "arms"
//     );
//     const clear = await db.runAsync(`delete from exercise`);
//     // const exerciseSetup = await db.runAsync(
//     //     "INSERT INTO exercise(musclegroupid, exercisename, notes, dateadded, dateupdated) VALUES (?, ?, ?, ?, ?)",
//     //     1,
//     //     "bench press",
//     //     "no notes",
//     //     "2025-01-02 10:00:00",
//     //     null
//     // );
//     const clearDummy = await db.runAsync("delete from dummy");
//     const insert = await db.runAsync(
//         `
//         INSERT INTO dummy (info) VALUES (?)`,
//         "hmmmmmm"
//     );
//     //const deleteStuff = await db.runAsync(`delete from dummy`);
//     //const res = await createTables.executeAsync();
//     //console.log(res);
//     //await createTables.finalizeAsync();
//     const newRes = await db.getAllAsync("SELECT * FROM dummy;");
//     const exerciseRes = await db.getAllAsync(`SELECT * FROM exercise`);
//     console.log(exerciseRes);
//     //await syncOutToServer(Date.now().toLocaleString());
// };

// export default initializeSQLiteDb;
