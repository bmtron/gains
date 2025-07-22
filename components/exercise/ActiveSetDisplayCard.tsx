import { ExerciseGroup } from "@/models/exerciseGroup";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import { RemoveExerciseSetProps } from "./ExerciseHelpers";

export interface ActiveSetDisplayCardProps {
    index: number;
    set: ExerciseSetDto;
    exerciseGroup: ExerciseGroup;
    removeSetHandler: (arg0: RemoveExerciseSetProps) => Promise<void>;
}
export const ActiveSetDisplayCard = ({
    index,
    set,
    exerciseGroup,
    removeSetHandler,
}: ActiveSetDisplayCardProps) => {
    const removeProps: RemoveExerciseSetProps = {
        index: index,
        group: exerciseGroup,
        exerciseGroups: [],
        setExerciseGroups: function (arg0: ExerciseGroup[]): void {
            throw new Error("Function not implemented.");
        },
    };
    return (
        <List.Item
            key={index}
            title={`Set ${index + 1}`}
            description={`Weight: ${set.weight}${
                exerciseGroup.weightUnit?.weightunitlabel || ""
            }, Reps: ${set.repetitions}${
                set.estimatedrpe ? `, RPE: ${set.estimatedrpe}` : ""
            }`}
            right={(props) => (
                <TouchableOpacity onPress={() => removeSetHandler(removeProps)}>
                    <List.Icon {...props} icon='delete' />
                </TouchableOpacity>
            )}
        />
    );
};
