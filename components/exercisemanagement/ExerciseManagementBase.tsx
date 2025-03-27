import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { router } from "expo-router";
import { useAppTheme } from "@/app/_layout";
import CustomAppBar from "../global/CustomAppBar";
import PaddedView from "../global/PaddedView";

export default function ExerciseManagementBase() {
    const theme = useAppTheme();
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <CustomAppBar title={"Exercise Management"} />
            <PaddedView>
                <Text variant='titleLarge' style={{ marginBottom: 16 }}>
                    Use this screen to add various items.
                </Text>
                <Text
                    variant='titleMedium'
                    style={{ marginBottom: 8, marginTop: 16 }}
                >
                    Exercise Inloading
                </Text>
                <Button
                    mode='contained-tonal'
                    onPress={() =>
                        router.push("/(tabs)/(configuration)/exercise")
                    }
                    style={{ marginVertical: 8 }}
                >
                    Exercise Inload
                </Button>
                <Text
                    variant='titleMedium'
                    style={{ marginBottom: 8, marginTop: 16 }}
                >
                    Exercise Library
                </Text>
                <Button
                    mode='contained-tonal'
                    onPress={() =>
                        router.push("/(tabs)/(configuration)/exerciseviewer")
                    }
                    style={{ marginVertical: 8 }}
                >
                    Exercise Viewer
                </Button>
            </PaddedView>
        </View>
    );
}
