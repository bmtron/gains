import { View } from "react-native";
import { Text } from "react-native-paper";
import { Link } from "expo-router";
import { useAppTheme } from "@/app/_layout";
import CustomAppBar from "../global/CustomAppBar";
import PaddedView from "../global/PaddedView";

export default function InloadBase() {
    const theme = useAppTheme();
    return (
        <View
            style={{
                flex: 1,

                backgroundColor: theme.colors.background,
            }}
        >
            <CustomAppBar title={"Inloading"} />
            <PaddedView>
                <Text>Use this screen to add various items.</Text>
                <Link
                    style={{ color: theme.colors.laserBlue }}
                    href='/(tabs)/(configuration)/exercise'
                >
                    Exercise Inload
                </Link>
            </PaddedView>
        </View>
    );
}
