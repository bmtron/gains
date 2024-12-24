import { View } from "react-native";
import { Text } from "react-native-paper";
import { Link } from "expo-router";
import { useAppTheme } from "@/app/_layout";

export default function InloadBase() {
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
            <Text>Use this screen to add various items.</Text>
            <Link
                style={{ color: theme.colors.laserBlue }}
                href='/(inload)/exercise'
            >
                Exercise Inload
            </Link>
        </View>
    );
}
