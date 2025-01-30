import { DB_NAME } from "@/constants/databaseconstants";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { WorkoutDto } from "@/models/workoutDto";

const transformExerciseSetSql = (sets: any[]): ExerciseSetDto[] => {
    return sets.map((set) => ({
        exerciseid: set.exercise_id,
        weight: set.weight,
        weightunitlookupid: set.weightunit_lookup_id,
        repetitions: set.repetitions,
        estimatedrpe: set.estimated_rpe,
    }));
};

export const workoutOperations = {
    addWorkout: async (workout: WorkoutDto) => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);

        console.log("WORKOUT_DTO_BELOW");
        console.log(workout);
        const workoutResult = await db.runAsync(
            `INSERT INTO workout (date_started, workout_server_id, last_modified, is_deleted, is_synced) VALUES (?, ?, ?, ?, ?);`,
            [workout.DateStarted.toISOString(), 0, 0, 0, 0]
        );

        workout.ExerciseSets.forEach(async (set) => {
            const exerciseSetResult = await db.runAsync(
                `INSERT INTO exerciseset (exerciseset_server_id, weight, weightunit_lookup_id, repetitions, estimated_rpe, exercise_id, workout_local_id, last_modified, is_synced, is_deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    0,
                    set.weight,
                    set.weightunitlookupid,
                    set.repetitions,
                    set.estimatedrpe,
                    set.exerciseid,
                    workoutResult.lastInsertRowId,
                    new Date().toLocaleDateString(),
                    0,
                    0,
                ]
            );
            console.log(exerciseSetResult);
        });
    },
    getUnsyncedWorkouts: async (): Promise<WorkoutDto[]> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        const workoutResult = await db.getAllAsync(
            "SELECT * FROM workout where is_synced = 0;"
        );

        const promises = workoutResult.map(async (wr: any) => {
            const exerciseResultSet = await db.getAllAsync(
                "SELECT * FROM exerciseset where workout_local_id = ?;",
                [wr.workout_local_id]
            );
            const dto: WorkoutDto = {
                WorkoutLocalId: wr.workout_local_id,
                DateStarted: wr.date_started,
                ExerciseSets: transformExerciseSetSql(exerciseResultSet),
            };
            console.log("DTO_");
            console.log(dto);
            return dto;
        });

        const workoutDtos = await Promise.all(promises);
        return workoutDtos;
    },
    markWorkoutDataSynced: async (
        workout_local_id: number
    ): Promise<boolean> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        try {
            const updateWorkoutResult = await db.runAsync(
                `UPDATE workout set is_synced = 1 where workout_local_id = ?;`,
                [workout_local_id]
            );
            const updateSetsResult = await db.runAsync(
                `UPDATE exerciseset set is_synced = 1 where workout_local_id = ?;`,
                [workout_local_id]
            );
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    syncInExercises: async (): Promise<void> => {},
};
