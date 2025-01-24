import { Stack } from "expo-router";

const WorkoutHistoryMain = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
        </Stack>
    );
};

export default WorkoutHistoryMain;
