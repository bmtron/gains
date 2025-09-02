import colorScheme from "@/constants/colorscheme";
import { Exercise } from "@/models/exerciseModels";
import MuscleGroup from "@/models/muscleGroupModels";
import { useState } from "react";
import { View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";

interface ExerciseDetailsProps {
    exercise: Exercise;
    musclegroup: MuscleGroup;
    hideDetailsModal: (showModal: boolean) => void;
    removeExercise: (exercise: Exercise) => Promise<void>;
    visible: boolean;
}

export const ExerciseDetailsModal = ({
    exercise,
    musclegroup,
    hideDetailsModal,
    visible,
    removeExercise,
}: ExerciseDetailsProps) => {
    const [editingName, setEditingName] = useState<boolean>(false);
    return (
        <Portal>
            <Modal
                visible={visible}
                contentContainerStyle={{
                    backgroundColor: colorScheme.background,
                    padding: 20,
                    width: "75%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                {editingName ? (
                    <TextInput style={{ fontSize: 20 }}>
                        {exercise.exercisename}
                    </TextInput>
                ) : (
                    <Text
                        onPress={() => setEditingName(true)}
                        style={{ fontSize: 20 }}
                    >
                        {exercise.exercisename}
                    </Text>
                )}
                <Text style={{ fontSize: 16 }}>
                    {musclegroup.musclegroupname}
                </Text>
                <View>
                    <Button
                        onPress={async () => {
                            console.log("DELETE PRESSED");
                            await removeExercise(exercise);
                            hideDetailsModal(false);
                        }}
                    >
                        Delete
                    </Button>
                    <Button onPress={() => hideDetailsModal(false)}>
                        Close
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};
