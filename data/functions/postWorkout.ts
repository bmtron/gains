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

    const dtoNoLocal: WorkoutDto = {
        // ???? I'm afraid to touch this but I don't know why it's here...
        DateStarted: workout.DateStarted,
        ExerciseSets: workout.ExerciseSets,
    };

    console.log(dtoNoLocal);
    const res = await fetch(endpoint + path, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoNoLocal),
    });
    const resData = await res.json();

    console.log(resData);
    if (resData) {
        return Promise.resolve();
    } else {
        return Promise.reject();
    }
}
