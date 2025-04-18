import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { databaseOperations } from "../localstorage/databaseOperations";

export const setExerciseDataServerId = async (
    workoutExerciseData: ExerciseSetDto[]
): Promise<ExerciseSetDto[]> => {
    const localExerciseData = await databaseOperations.getAllLocalExercises();
    return workoutExerciseData.map((exercise) => {
        if (exercise.exerciseserverid > 0) {
            return exercise;
        }
        const localExercise = localExerciseData.find(
            (e) => e.exerciseLocalId === exercise.exerciselocalid
        );
        exercise.exerciseserverid = localExercise?.exerciseid!;
        return exercise;
    });
};
