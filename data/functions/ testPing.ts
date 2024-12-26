import {
    serverAddress,
    serverAddressDebug,
    serverAddressWebDebug,
} from "@/constants/serveraddress";
import { convert_response_to } from "@/helpers/JsonConverter";
import { Platform } from "react-native";

const TestPing = async () => {
    const endpoint = __DEV__
        ? Platform.OS === "web"
            ? serverAddressWebDebug
            : serverAddressDebug
        : serverAddress;
    const path = "/arewelive";

    const res = await fetch(endpoint + path);
    const data = res;

    return data;
};

export default TestPing;
