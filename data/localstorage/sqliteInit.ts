import { Platform } from "react-native";
import { useSelector } from "react-redux";

const initializeSQLiteDb = async () => {
    const SQLite = await import("expo-sqlite");
    const db = await SQLite.openDatabaseAsync("gains.db");
    console.log(db);
    const createTables = await db.execAsync(`
        CREATE TABLE IF NOT EXISTS musclegroup 
        (
            musclegroupid INTEGER PRIMARY KEY AUTOINCREMENT,
            musclegroupname TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS exercise 
        (
            exerciseid INTEGER PRIMARY KEY AUTOINCREMENT,
            musclegroupid INTEGER NOT NULL,
            exercisename TEXT NOT NULL,
            notes TEXT NOT NULL,
            dateadded TEXT NOT NULL,
            dateupdated TEXT,
            FOREIGN KEY (musclegroupid) REFERENCES musclegroup(musclegroupid)
        );
        CREATE TABLE IF NOT EXISTS dummy
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            info TEXT NOT NULL
        );

        `);
    //const res = await createTables.executeAsync();
    //console.log(res);
    //await createTables.finalizeAsync();
    const newRes = await db.getAllAsync("SELECT * FROM dummy;");
    console.log(newRes);
};

export default initializeSQLiteDb;
