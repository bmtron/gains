import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../state_store/store";
import colorScheme from "@/constants/colorscheme";
import { SafeAreaProvider } from "react-native-safe-area-context";

const baseTheme = MD3DarkTheme;

const theme = {
    ...baseTheme,
    colors: {
        ...baseTheme.colors,
        background: colorScheme.background,
        primary: colorScheme.primary,
        secondary: colorScheme.secondary,
        paperWhite: colorScheme.customWhite,
        laserBlue: colorScheme.tokyoLaserBlue,
        buttonStandard: colorScheme.standardButtonBg,
    },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => theme;

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name='(tabs)' />
                    </Stack>
                </PaperProvider>
            </Provider>
        </SafeAreaProvider>
    );
}
