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
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors.background,
            }}
        >
            <Text>Home Screen</Text>
            <Link href='/settings' style={{ color: theme.colors.laserBlue }}>
                Settings
            </Link>
            <Link href='../(inload)' style={{ color: theme.colors.laserBlue }}>
                Inload
            </Link>
        </View>
    );
}
