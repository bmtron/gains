import { Stack } from "expo-router";

const Exercise = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
        </Stack>
    );
};

export default Exercise;
