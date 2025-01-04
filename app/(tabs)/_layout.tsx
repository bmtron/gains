import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAppTheme } from "../_layout";

export default function TabLayout() {
    const theme = useAppTheme();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: theme.colors.background },
            }}
        >
            <Tabs.Screen name='(home)' options={{ title: "Home" }} />
            <Tabs.Screen name='(inload)' options={{ href: null }} />
            <Tabs.Screen name='(workout)' options={{ title: "Workout" }} />
            <Tabs.Screen name='(exercise)' options={{ title: "Exercises" }} />
        </Tabs>
    );
}
