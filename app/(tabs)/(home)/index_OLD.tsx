import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Link } from "expo-router";
import { useAppTheme } from "@/app/_layout";

export default function Index() {
    const theme = useAppTheme();
    return (
        <View
            style={{
                flex: 1,

                backgroundColor: theme.colors.background,
            }}
        >
            <Text>Home Screen</Text>
            <Link href='/settings' style={{ color: theme.colors.laserBlue }}>
                Settings
            </Link>
            <Link
                href='/(tabs)/(configuration)'
                style={{ color: theme.colors.laserBlue }}
            >
                Inload
            </Link>
        </View>
    );
}
