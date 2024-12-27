import { Tabs } from "expo-router";
import initializeSQLiteDb from "@/data/localstorage/sqliteInit";
import { useEffect } from "react";

export default function TabLayout() {
    useEffect(() => {
        const initDb = async () => {
            console.log("initing sqlite db...");
            await initializeSQLiteDb();
        };
        initDb();
    }, []);
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name='(home)' />
            <Tabs.Screen name='(inload)' />
        </Tabs>
    );
}
