import {
    serverAddress,
    serverAddressDebug,
    serverAddressWebDebug,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Platform } from "react-native";
import { WorkoutDto } from "@/models/workoutDto";

export async function postWorkout(workout: WorkoutDto): Promise<boolean> {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;
    const path = "/workout";
    console.log(JSON.stringify(workout));
    const res = await fetch(endpoint + path, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
    });

    const resData = await res.json();
    console.log(resData);
    return convert_response_to<boolean>(resData);
}
