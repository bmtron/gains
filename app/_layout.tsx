import { Stack } from "expo-router";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../state_store/store";
import colorScheme from "@/constants/colorscheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
        placeholder: colorScheme.tokyoLaserBlueDulled,
    },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => theme;

export default function RootLayout() {
    const reset_DEV = true;
    if (reset_DEV) {
        try {
            AsyncStorage.clear();
        } catch (e) {
            console.log("Failed to clear async storage: " + e);
        }
    }
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <PaperProvider theme={theme}>
                    <GestureHandlerRootView>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                statusBarBackgroundColor:
                                    theme.colors.background,
                            }}
                        >
                            <Stack.Screen name='(tabs)' />
                        </Stack>
                    </GestureHandlerRootView>
                </PaperProvider>
            </Provider>
        </SafeAreaProvider>
    );
}
