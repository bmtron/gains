import { Exercise, ExerciseDto } from "@/models/exerciseModels";
import {
    serverAddress,
    serverAddressDebug,
    serverAddressWebDebug,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Platform } from "react-native";

export async function deleteExercise(exercise: Exercise): Promise<boolean> {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;
    const path = "/exercise";
    console.log(endpoint);
    const res = await fetch(endpoint + path + "/" + exercise.exerciseid, {
        method: "delete",
        headers: { "Content-Type": "application/json" },
    });

    const resData = await res.json();
    console.log(resData);
    return convert_response_to<boolean>(resData);
}
