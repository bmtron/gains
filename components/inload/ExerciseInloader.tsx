import { useAppTheme } from "@/app/_layout";
import { SafeAreaView, View } from "react-native";
import {
    Text,
    TextInput,
    Button as RNPButton,
    Portal,
    Dialog,
    RadioButton,
} from "react-native-paper";
import CustomAppBar from "../global/CustomAppBar";
import { useEffect, useState } from "react";
import { postExercise } from "@/data/functions/postExercise";
import { ExerciseDto } from "@/models/exerciseModels";
import TestPing from "@/data/functions/ testPing";
import useGetMuscleGroups from "@/data/functions/getMuscleGroups";
import MuscleGroup from "@/models/muscleGroupModels";
import { CustomDialog } from "../global/CustomDialog";
import { hide } from "expo-router/build/utils/splash";
import getMuscleGroups from "@/data/functions/getMuscleGroups";
import { Button } from "@/components/global/ThemedButton";

const ExerciseInloader = () => {
    const theme = useAppTheme();
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>();
    const [exerciseName, setExerciseName] = useState<string>("");
    const [exerciseNotes, setExerciseNotes] = useState<string>("");
    const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number>();
    const [radioGroupValue, setRadioGroupValue] = useState<string>("");

    const [dialogText, setDialogText] = useState<string>("");
    const [dialogTitle, setDialogTitle] = useState<string>("");

    useEffect(() => {
        const muscleGroupFetcher = async () => {
            try {
                const data = await getMuscleGroups();
                setMuscleGroups(data);
            } catch (err) {
                setDialogTitle("Error Loading Muscle Groups");
                setDialogText(
                    "Something went wrong when submitting the exercise to the server. Please try again or check your connection."
                );
            }
        };

        muscleGroupFetcher();
    }, []);

    function clearDialogInfo() {
        setDialogText("");
        setDialogTitle("");
    }

    const showErrorDialog = () => setIsDialogVisible(true);
    const hideErrorDialog = () => {
        clearDialogInfo();
        setIsDialogVisible(false);
    };

    const handleMuscleGroupRadioSelect = (value: string) => {
        const groupId = parseInt(value);
        setRadioGroupValue(value);
        const selectedMuscleGroup = muscleGroups?.find(
            (group) => group.musclegroupid === groupId
        );
        setSelectedMuscleGroup(selectedMuscleGroup?.musclegroupid);
    };
    const renderMuscleGroupList = () => {
        return (
            <RadioButton.Group
                onValueChange={(value) => handleMuscleGroupRadioSelect(value)}
                value={radioGroupValue}
            >
                {muscleGroups?.map((group, index) => {
                    return (
                        <RadioButton.Item
                            key={index}
                            label={group.musclegroupname}
                            value={group.musclegroupid.toString()}
                        />
                    );
                })}
            </RadioButton.Group>
        );
    };

    async function submit() {
        if (selectedMuscleGroup === undefined) {
            setDialogTitle("Invalid Muscle Group Id");
            setDialogText(
                "Failed to properly set the selected muscle group id."
            );
            showErrorDialog();
            return;
        }

        const dto: ExerciseDto = {
            name: exerciseName,
            notes: exerciseNotes,
            musclegroupid: selectedMuscleGroup,
        };

        const result = await postExercise(dto);

        if (!result) {
            setDialogTitle("Error Submitting Exercise");
            setDialogText(
                "Something went wrong when submitting the exercise to the server. Please try again or check your connection."
            );
            showErrorDialog();
        } else {
            setExerciseName("");
            setExerciseNotes("");
        }
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <CustomAppBar title='Exercise Inloader' />
            <TextInput
                placeholder='Name'
                value={exerciseName}
                onChangeText={(text) => setExerciseName(text)}
            />
            <TextInput
                placeholder='Notes'
                value={exerciseNotes}
                onChangeText={(text) => setExerciseNotes(text)}
            />
            {renderMuscleGroupList()}
            <View style={{ flex: 1, alignItems: "center" }}>
                <Button
                    onPress={async () => await submit()}
                    text={"Add Exercise"}
                />
            </View>
            <Portal>
                <CustomDialog
                    title={dialogTitle}
                    dialogText={dialogText}
                    visible={isDialogVisible}
                    hideDialog={hideErrorDialog}
                />
            </Portal>
        </View>
    );
};

export default ExerciseInloader;
