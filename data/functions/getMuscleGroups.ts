import {
    serverAddressWebDebug,
    serverAddressDebug,
    serverAddress,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import MuscleGroup from "@/models/muscleGroupModels";
import { Platform } from "react-native";

const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;

    const path = "/musclegroup";

    const res = await fetch(endpoint + path);
    const data = await res.json();
    return convert_response_to<MuscleGroup[]>(data);
};

export default getMuscleGroups;
