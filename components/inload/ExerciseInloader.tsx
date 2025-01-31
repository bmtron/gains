import { useAppTheme } from "@/app/_layout";
import { Platform, View } from "react-native";
import { TextInput, Portal, RadioButton } from "react-native-paper";
import CustomAppBar from "../global/CustomAppBar";
import { useCallback, useEffect, useState } from "react";
import {
    postExercise,
    postExerciseWithResult,
} from "@/data/functions/postExercise";
import { ExerciseDto } from "@/models/exerciseModels";
import MuscleGroup from "@/models/muscleGroupModels";
import { CustomDialog } from "../global/CustomDialog";
import { Button } from "@/components/global/ThemedButton";
import getAllItems from "@/data/functions/getAllItems";
import PaddedView from "../global/PaddedView";
import { databaseOperations } from "@/data/localstorage/databaseOperations";
import { useFocusEffect } from "expo-router";
import FailureBanner from "../common/FailureBanner";

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
    const [hasUnsyncedExercises, setHasUnsyncedExercises] =
        useState<boolean>(false);
    const [unsyncedExercises, setUnsyncedExercises] = useState<ExerciseDto[]>(
        []
    );

    useEffect(() => {
        const muscleGroupFetcher = async () => {
            try {
                const data = await getAllItems<MuscleGroup[]>("/musclegroup");
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

    // There is a known issue at the moment where adding a workout that contains a new, unsynced exercise
    // fails to add to the remote database. That is because the exercise id is being set incorrectly
    // (it doesn't exist on the server)
    // will have to circle back at some point and address this,
    // for now, just workaround it by not adding workouts with unsynced exercises.
    const retryExerciseSync = async () => {
        const results = unsyncedExercises.map(async (exercise) => {
            const serverResult = await postExerciseWithResult(exercise);
            const localUpdate =
                await databaseOperations.updateExerciseWithServerId(
                    serverResult,
                    exercise.exerciseLocalId!
                );
            if (serverResult !== -1 && localUpdate) {
                return true;
            } else {
                return false;
            }
        });
        const res = await Promise.all(results);
        if (res.find((result) => !result) === undefined) {
            // if none of the results are false
            setHasUnsyncedExercises(false);
            setUnsyncedExercises([]);
        }
    };
    const checkForUnsyncedExercises = async () => {
        const unsyncedExerciseDtos =
            await databaseOperations.getUnsyncedExercises();

        if (unsyncedExerciseDtos !== null && unsyncedExerciseDtos.length > 0) {
            setHasUnsyncedExercises(true);
            setUnsyncedExercises(unsyncedExerciseDtos);
        }
    };
    useFocusEffect(
        useCallback(() => {
            const handleUnsyncCheck = async () => {
                await checkForUnsyncedExercises();
            };
            handleUnsyncCheck();
        }, [])
    );

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
        const insertResult = await databaseOperations.addExercise(dto);
        if (insertResult === -1) {
            setDialogTitle("Error Adding Exercise");
            setDialogText(
                "Something went wrong adding the exercise to local storage. Please reload the screen and try again."
            );
            showErrorDialog();
            return;
        }
        const resultServerId = -1; //await postExerciseWithResult(dto);

        if (resultServerId === -1) {
            setDialogTitle("Error Submitting Exercise");
            setDialogText(
                "Something went wrong when submitting the exercise to the server. Please try again or check your connection."
            );
            showErrorDialog();
            await checkForUnsyncedExercises();
        } else {
            const updateResult =
                await databaseOperations.updateExerciseWithServerId(
                    resultServerId,
                    insertResult
                );
            if (!updateResult) {
                setDialogTitle("Error Updating Exercise");
                setDialogText(
                    "Something went wrong updating the exercise in local storage."
                );
                showErrorDialog();
            }
        }
        setExerciseName("");
        setExerciseNotes("");
    }
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <CustomAppBar title='Exercise Inloader' />
            <PaddedView>
                {hasUnsyncedExercises && (
                    <FailureBanner
                        alertText='Failure Syncing Exercises'
                        buttonText='Retry Sync'
                        buttonCallback={retryExerciseSync}
                    />
                )}
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
            </PaddedView>
        </View>
    );
};

export default ExerciseInloader;
