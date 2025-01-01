import {
    serverAddressWebDebug,
    serverAddressDebug,
    serverAddress,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Platform } from "react-native";

async function getAllItems<T>(path: string): Promise<T> {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;

    const res = await fetch(endpoint + path);
    const data = await res.json();
    return convert_response_to<T>(data);
}

export default getAllItems;
