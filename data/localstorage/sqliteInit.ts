import * as SQLite from "expo-sqlite";
import { useSelector } from "react-redux";
import {
    store,
    gainsSqlActionSpecifier,
    GainsSqlActionObject,
} from "@/state_store/store";

const initializeSQLiteDb = async () => {
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
        INSERT INTO dummy (info)
        VALUES ('some dummy info, ya dummy');
        `);
    //const res = await createTables.executeAsync();
    //console.log(res);
    //await createTables.finalizeAsync();
    const newRes = await db.getAllAsync("SELECT * FROM exercise;");
    console.log(newRes);
};

export default initializeSQLiteDb;
