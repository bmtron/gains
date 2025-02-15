import { Stack } from "expo-router";

export default function Home() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='settings' />
        </Stack>
    );
}
