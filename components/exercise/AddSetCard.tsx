import exercise from "@/app/(tabs)/(configuration)/exercise";
import { ExerciseGroup } from "@/models/exerciseGroup";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { View } from "react-native";
import { List, Button, TextInput } from "react-native-paper";

export interface AddSetProps {
    exercise: ExerciseGroup;
    weight: string;
    setWeight: (arg0: string) => void;
    reps: string;
    setReps: (arg0: string) => void;
    rpe: string;
    setRpe: (arg0: string) => void;
    exerciseGroups: ExerciseGroup[];
    setExerciseGroups: (arg0: ExerciseGroup[]) => void;
    modalVisibilityHandler: (arg0: boolean) => void;
    modalMessageHandler: (arg0: string) => void;
    onGroupsChange?: (groups: ExerciseGroup[]) => void;
}
export const AddSetCard = ({
    exercise,
    weight,
    setWeight,
    reps,
    setReps,
    rpe,
    setRpe,
    exerciseGroups,
    setExerciseGroups,
    modalVisibilityHandler,
    modalMessageHandler,
    onGroupsChange,
}: AddSetProps) => {
    const handleAddSet = async (groupName: string) => {
        const group = exerciseGroups.find((g) => g.name === groupName);
        if (group === undefined) return;
        if (!group.weightUnit) {
            modalVisibilityHandler(true);
            modalMessageHandler(
                "You have not selected a weight unit. Please make a valid selection."
            );
            return;
        }
        if (!weight) {
            modalVisibilityHandler(true);
            modalMessageHandler(
                "You must select a value for weight to continue."
            );
            return;
        }
        if (!reps) {
            modalVisibilityHandler(true);
            modalMessageHandler("You must select a value for reps to continue");
            return;
        }
        const newSet: ExerciseSetDto = {
            exerciselocalid: group?.exerciselocalid,
            exerciseserverid: group?.exerciseid,
            weight: parseFloat(weight),
            repetitions: parseInt(reps),
            estimatedrpe: rpe ? parseFloat(rpe) : 0,
            weightunitlookupid:
                group.weightUnit !== undefined
                    ? group.weightUnit.weightunitlookupid
                    : 0,
        };

        const updatedGroups = exerciseGroups.map((group) =>
            group.name === groupName
                ? {
                      ...group,
                      sets: [...group.sets, newSet],
                  }
                : group
        );

        setExerciseGroups(updatedGroups);

        if (onGroupsChange) {
            onGroupsChange(updatedGroups);
        }
        setWeight("");
        setReps("");
        setRpe("");
    };
    return (
        <View style={{ padding: 8 }}>
            <List.Accordion title='New Set...'>
                <TextInput
                    placeholder={
                        "Weight (" + exercise.weightUnit?.weightunitlabel + ")"
                    }
                    value={weight}
                    keyboardType='numeric'
                    textContentType='none'
                    onChangeText={(text) => setWeight(text)}
                    style={{ marginBottom: 8 }}
                />
                <TextInput
                    label='Repetitions'
                    value={reps}
                    onChangeText={setReps}
                    keyboardType='numeric'
                    style={{ marginBottom: 8 }}
                />
                <TextInput
                    label='RPE (optional)'
                    value={rpe}
                    onChangeText={setRpe}
                    keyboardType='numeric'
                    style={{ marginBottom: 8 }}
                />
            </List.Accordion>
            <Button
                mode='contained'
                onPress={() => handleAddSet(exercise.name)}
            >
                Add Set
            </Button>
        </View>
    );
};
