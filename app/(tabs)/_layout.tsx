import { Tabs } from "expo-router";
import initializeSQLiteDb from "@/data/localstorage/sqliteInit";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAppTheme } from "../_layout";

export default function TabLayout() {
    const theme = useAppTheme();
    useEffect(() => {
        const initDb = async () => {
            initializeSQLiteDb();
        };
        if (Platform.OS !== "web") {
            initDb();
        }
    }, []);
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: theme.colors.background },
            }}
        >
            <Tabs.Screen name='(home)' />
            {__DEV__ ? <Tabs.Screen name='(inload)' /> : <></>}
        </Tabs>
    );
}
