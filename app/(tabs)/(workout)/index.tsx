import Workout from "@/components/workout/Workout";
import { SafeAreaView } from "react-native-safe-area-context";

const WorkoutBase = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Workout />
        </SafeAreaView>
    );
};

export default WorkoutBase;
