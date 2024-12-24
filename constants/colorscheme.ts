import { MD2Colors, MD2Theme } from "react-native-paper/lib/typescript/types";

type ColorScheme = {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    headers: string;
    accent: string;
    error: string;
    customWhite: string;
    tokyoLaserBlue: string;
};

const colorScheme: ColorScheme = {
    background: "#1a1b26",
    text: "#FFFFFF",
    primary: "#DBD1B6",
    secondary: "#3A86FF",
    headers: "#2ac3de",
    accent: "#FF3D71",
    error: "#FF3D71",
    customWhite: "#DBD1B6",
    tokyoLaserBlue: "#2AC3DE",
};

export default colorScheme;
