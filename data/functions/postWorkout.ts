import {
    serverAddress,
    serverAddressDebug,
    serverAddressWebDebug,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Platform } from "react-native";
import { WorkoutDto } from "@/models/workoutDto";

export async function postWorkout(workout: WorkoutDto) {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;
    const path = "/workout";

    console.log(workout.DateStarted);
    const dtoNoLocal: WorkoutDto = {
        DateStarted: workout.DateStarted,
        ExerciseSets: workout.ExerciseSets,
    };
    console.log(new Date(workout.DateStarted));
    console.log(JSON.stringify(dtoNoLocal));
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
