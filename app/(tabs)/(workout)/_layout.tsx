import { Stack } from "expo-router";

const Workout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
        </Stack>
    );
};

export default Workout;
