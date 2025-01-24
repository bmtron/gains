import {
    serverAddressWebDebug,
    serverAddressDebug,
    serverAddress,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import ExerciseSet from "@/models/exercisesetModels";

import { Platform } from "react-native";

const getAllExerciseSets = async (): Promise<ExerciseSet[]> => {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;

    const path = "/exerciseset";

    const res = await fetch(endpoint + path);
    const data = await res.json();
    return convert_response_to<ExerciseSet[]>(data);
};

export default getAllExerciseSets;
