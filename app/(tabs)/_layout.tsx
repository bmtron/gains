import { Tabs } from "expo-router";
import { useAppTheme } from "../_layout";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
    const theme = useAppTheme();
    return (
        <Tabs
            initialRouteName='index'
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: theme.colors.background },
                tabBarActiveTintColor: theme.colors.primary,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name='home'
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen name='(configuration)' options={{ href: null }} />
            <Tabs.Screen
                name='(workout)'
                options={{
                    title: "Workout",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name='weight-lifter'
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='(workouthistory)'
                options={{
                    title: "Workout History",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name='history'
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
