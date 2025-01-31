import HistoricalExerciseSet from "@/models/historicalExerciseSet";
import { WeightUnit } from "@/models/weightUnit";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";

interface ExerciseHistoryProps {
    exerciseId: number;
    historicalSets: HistoricalExerciseSet[];
}
const ExerciseHistory = ({
    exerciseId,
    historicalSets,
}: ExerciseHistoryProps) => {
    const history =
        historicalSets.filter((set) => set.exerciseId === exerciseId) || [];
    if (history.length === 0) {
        return (
            <Card style={{ margin: 8, padding: 8 }}>
                <Text>No previous workout data available.</Text>
            </Card>
        );
    }
    const mostRecentWorkoutId = Math.max(
        ...history.map((set) => set.workoutid || 0)
    );
    const filteredHistoryItems = history
        .slice(-3)
        .filter((set) => set.workoutid === mostRecentWorkoutId);
    return (
        <View style={{ margin: 8 }}>
            <Text style={{ fontWeight: "bold" }}>
                {filteredHistoryItems[0].date === undefined
                    ? ""
                    : new Date(
                          filteredHistoryItems[0].date
                      ).toLocaleDateString()}
            </Text>
            <Card style={{ marginBottom: 8, padding: 8 }}>
                {filteredHistoryItems.map((set, idx) => (
                    <Text key={idx}>
                        Set {idx + 1}: {set.weight}
                        {set.weightUnit.weightunitlabel} x {set.reps} reps
                        {set.rpe ? ` @ RPE ${set.rpe}` : ""}
                    </Text>
                ))}
            </Card>
        </View>
    );
};
export default ExerciseHistory;
