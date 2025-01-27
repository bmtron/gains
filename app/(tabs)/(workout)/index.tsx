import { useAppTheme } from "@/app/_layout";
import Workout from "@/components/workout/Workout";
import { SafeAreaView } from "react-native-safe-area-context";

const WorkoutBase = () => {
    const theme = useAppTheme();

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <Workout />
        </SafeAreaView>
    );
};

export default WorkoutBase;
