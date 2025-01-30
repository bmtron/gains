import { DB_NAME } from "@/constants/databaseconstants";

const initDatabase = async () => {
    console.log("RUN_DB_INIT_");
    const SQLite = await import("expo-sqlite");
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS workout (
                workout_local_id INTEGER PRIMARY KEY NOT NULL,
                workout_server_id INTEGER NOT NULL,
                date_started TEXT NOT NULL,
                is_synced INTEGER,
                last_modified TEXT,
                is_deleted INTEGER
            );`);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS exerciseset (
            exerciseset_local_id INTEGER PRIMARY KEY NOT NULL,
            exerciseset_server_id INTEGER NOT NULL DEFAULT 0,
            weight TEXT NOT NULL,
            weightunit_lookup_id INTEGER NOT NULL,
            repetitions INTEGER NOT NULL,
            estimated_rpe INTEGER NOT NULL,
            exercise_id INTEGER NOT NULL,
            date_added TEXT,
            workout_server_id INTEGER DEFAULT 0,
            workout_local_id INTEGER,
            is_synced INTEGER,
            last_modified TIMESTAMP,
            is_deleted INTEGER
);`);
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS exercise (
            exercise_local_id INTEGER PRIMARY KEY NOT NULL,
            exercise_server_id INTEGER NOT NULL DEFAULT 0,
            muscle_group_id INTEGER NOT NULL,
            exercise_name TEXT NOT NULL,
            notes TEXT NOT NULL,
            date_added TEXT NOT NULL,
            date_updated TEXT
        );
        `);
    console.log("RAN_INIT_DB_");
};
export { initDatabase };
