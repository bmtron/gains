import { View } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/app/_layout";

export default function Settings() {
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
            <Text>Settings</Text>
        </View>
    );
}
