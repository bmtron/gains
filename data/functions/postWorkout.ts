import {
    serverAddress,
    serverAddressDebug,
    serverAddressWebDebug,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Platform } from "react-native";
import { WorkoutDto } from "@/models/workoutDto";
import { databaseOperations } from "../localstorage/databaseOperations";
import { retryExerciseAdd } from "@/helpers/retryExerciseAdd";

export async function postWorkout(workout: WorkoutDto) {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;
    const path = "/workout";

    const unsyncedExerciseDtos =
        await databaseOperations.getUnsyncedExercises();

    if (unsyncedExerciseDtos !== null && unsyncedExerciseDtos.length > 0) {
        let retrySucceeded = await retryExerciseAdd(unsyncedExerciseDtos);
        if (!retrySucceeded) {
            // don't bother continuing
            return Promise.reject();
        }
        let exercisesLocal = await databaseOperations.getAllLocalExercises();
        workout.ExerciseSets.forEach(async (set) => {
            if (set.exerciseserverid == -1) {
                set.exerciseserverid = exercisesLocal.filter(
                    (e) => e.exerciseLocalId == set.exerciselocalid
                )[0].exerciseid;
            }
        });
    }

    const dtoNoLocal: WorkoutDto = {
        // ???? I'm afraid to touch this but I don't know why it's here...
        DateStarted: workout.DateStarted,
        ExerciseSets: workout.ExerciseSets,
    };

    const res = await fetch(endpoint + path, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoNoLocal),
    });
    const resData = await res.json();

    if (resData) {
        return Promise.resolve();
    } else {
        return Promise.reject();
    }
}
