import { useAppTheme } from "@/app/_layout";
import { Stack } from "expo-router";

export default function InloadingLayout() {
    const theme = useAppTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
            }}
        >
            <Stack.Screen name='index' />
            <Stack.Screen name='exercise' />
        </Stack>
    );
}
