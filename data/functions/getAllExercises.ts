import {
    serverAddressWebDebug,
    serverAddressDebug,
    serverAddress,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Exercise } from "@/models/exerciseModels";

import { Platform } from "react-native";

const getAllExercises = async (): Promise<Exercise[]> => {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;

    const path = "/exercise";

    const res = await fetch(endpoint + path);
    const data = await res.json();
    return convert_response_to<Exercise[]>(data);
};

export default getAllExercises;
