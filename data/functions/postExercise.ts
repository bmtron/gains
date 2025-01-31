import { ExerciseDto } from "@/models/exerciseModels";
import {
    serverAddress,
    serverAddressDebug,
    serverAddressWebDebug,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Platform } from "react-native";

export async function postExercise(exercise: ExerciseDto): Promise<boolean> {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;
    const path = "/exercise";
    const res = await fetch(endpoint + path, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
    });

    const resData = await res.json();
    return convert_response_to<boolean>(resData);
}

export async function postExerciseWithResult(
    exercise: ExerciseDto
): Promise<number> {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;
    const path = "/exercise/new";
    const res = await fetch(endpoint + path, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
    });
    const resData = await res.json();
    return convert_response_to<number>(resData);
}
