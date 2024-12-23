import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function Index() {
    const theme = useTheme();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.colors.background,
            }}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <Text>Some new text, is this working?</Text>
            <Text>Testing remote repo sync.</Text>
            <Text>Yes, it does.</Text>
        </View>
    );
}
