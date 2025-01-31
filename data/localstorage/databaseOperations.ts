import { DB_NAME } from "@/constants/databaseconstants";
import { Exercise, ExerciseDto, ExerciseLocal } from "@/models/exerciseModels";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { WorkoutDto } from "@/models/workoutDto";
import getAllItems from "../functions/getAllItems";

const transformExerciseSetSql = (sets: any[]): ExerciseSetDto[] => {
    return sets.map((set) => ({
        exerciselocalid: set.exercise_local_id,
        exerciseserverid: set.exercise_id,
        weight: set.weight,
        weightunitlookupid: set.weightunit_lookup_id,
        repetitions: set.repetitions,
        estimatedrpe: set.estimated_rpe,
    }));
};

export const databaseOperations = {
    addWorkout: async (workout: WorkoutDto) => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);

        const workoutResult = await db.runAsync(
            `INSERT INTO workout (date_started, workout_server_id, last_modified, is_deleted, is_synced) VALUES (?, ?, ?, ?, ?);`,
            [workout.DateStarted.toISOString(), 0, 0, 0, 0]
        );

        workout.ExerciseSets.forEach(async (set) => {
            const exerciseSetResult = await db.runAsync(
                `INSERT INTO exerciseset (exerciseset_server_id, weight, weightunit_lookup_id, repetitions, estimated_rpe, exercise_local_id, exercise_server_id, workout_local_id, last_modified, is_synced, is_deleted)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    0,
                    set.weight,
                    set.weightunitlookupid,
                    set.repetitions,
                    set.estimatedrpe,
                    set.exerciselocalid,
                    set.exerciseserverid,
                    workoutResult.lastInsertRowId,
                    new Date().toLocaleDateString(),
                    0,
                    0,
                ]
            );
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
    syncInExercises: async (): Promise<void> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        const data = await getAllItems<Exercise[]>("/exercise");
        const existingLocalData = await db.getAllAsync(
            `SELECT exercise_server_id, muscle_group_id, exercise_name, notes, date_added FROM exercise;`
        );
        const proms = data.map(async (exercise) => {
            if (
                existingLocalData.find(
                    (item: any) =>
                        item.exercise_server_id === exercise.exerciseid
                ) === undefined
            ) {
                const test = await db.runAsync(
                    `INSERT INTO exercise (exercise_server_id, muscle_group_id, exercise_name, notes, date_added, is_synced) VALUES (?, ?, ?, ?, ?, ?);`,
                    [
                        exercise.exerciseid,
                        exercise.musclegroupid,
                        exercise.exercisename,
                        exercise.notes,
                        exercise.dateadded + "",
                        1,
                    ]
                );

                return test;
            }
        });
        await Promise.all(proms);
        console.log("INSERT_END");
    },
    addExercise: async (exerciseDto: ExerciseDto): Promise<number> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        try {
            const insertedResult = await db.runAsync(
                `INSERT INTO exercise (muscle_group_id, exercise_name, notes, date_added, is_synced) VALUES (?, ?, ?, ?, ?);`,
                [
                    exerciseDto.musclegroupid,
                    exerciseDto.name,
                    exerciseDto.notes,
                    new Date().toISOString(),
                    0,
                ]
            );
            return insertedResult.lastInsertRowId;
        } catch (error) {
            console.error(error);
            return -1;
        }
    },
    updateExerciseWithServerId: async (
        serverId: number,
        localId: number
    ): Promise<boolean> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        try {
            const updatedResult = await db.runAsync(
                `UPDATE exercise SET exercise_server_id = ?, is_synced = 1 WHERE exercise_local_id = ?;`,
                [serverId, localId]
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    getUnsyncedExercises: async (): Promise<ExerciseDto[] | null> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);

        try {
            const updatedResult = await db.getAllAsync(
                `SELECT exercise_local_id, muscle_group_id, exercise_name, notes FROM exercise where is_synced = ?;`,
                [0]
            );
            const dtos: ExerciseDto[] = updatedResult.map((exercise: any) => {
                return {
                    exerciseLocalId: exercise.exercise_local_id,
                    name: exercise.exercise_name,
                    musclegroupid: exercise.muscle_group_id,
                    notes: exercise.notes,
                };
            });
            return dtos;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    getAllLocalExercises: async (): Promise<ExerciseLocal[]> => {
        const SQLite = await import("expo-sqlite");
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        try {
            const result = await db.getAllAsync("SELECT * FROM exercise;");
            const resultMap = result.map((res: any) => {
                return {
                    exerciseLocalId: res.exercise_local_id,
                    exerciseid: res.exercise_server_id,
                    musclegroupid: res.muscle_group_id,
                    exercisename: res.exercise_name,
                    notes: res.notes,
                    dateadded: res.date_added,
                    dateupdated: null,
                };
            });
            const promises = await Promise.all(resultMap);
            return promises;
        } catch (error) {
            console.error(error);
        }
        return [];
    },
};
