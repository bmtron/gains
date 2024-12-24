import { useAppTheme } from "@/app/_layout";
import { SafeAreaView, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import CustomAppBar from "../global/CustomAppBar";

export default function ExerciseInloader() {
    const theme = useAppTheme();
    return (
        <SafeAreaView
            style={{
                flex: 1,

                backgroundColor: theme.colors.background,
            }}
        >
            <CustomAppBar title='Exercise Inloader' />
            <TextInput />
        </SafeAreaView>
    );
}
