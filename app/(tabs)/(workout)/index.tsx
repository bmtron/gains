import ExerciseGroupList from "@/components/exercise/ExerciseGroupList";
import Workout from "@/components/workout/Workout";
import { SafeAreaView } from "react-native-safe-area-context";

const WorkoutBase = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Workout />
            {/* <ExerciseGroupList /> */}
        </SafeAreaView>
    );
};

export default WorkoutBase;
