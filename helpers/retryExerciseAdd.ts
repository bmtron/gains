import { postExerciseWithResult } from "@/data/functions/postExercise";
import { databaseOperations } from "@/data/localstorage/databaseOperations";
import { ExerciseDto } from "@/models/exerciseModels";

export async function retryExerciseAdd(
    unsyncedExercises: ExerciseDto[]
): Promise<boolean> {
    const results = unsyncedExercises.map(async (exercise) => {
        const serverResult = await postExerciseWithResult(exercise);
        const localUpdate = await databaseOperations.updateExerciseWithServerId(
            serverResult,
            exercise.exerciseLocalId!
        );
        if (serverResult !== -1 && localUpdate) {
            return true;
        } else {
            return false;
        }
    });

    const res = await Promise.all(results);
    if (res.find((result) => !result) === undefined) {
        // if none of the results are false, we succeeded! so return true, for "retry exercise add is true"
        return true;
    }
    return false;
}
