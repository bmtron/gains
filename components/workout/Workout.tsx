import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import ExerciseGroupList from "../exercise/ExerciseGroupList";
import { useAppTheme } from "@/app/_layout";
import { postWorkout } from "@/data/functions/postWorkout";
import { ExerciseGroup } from "@/models/exerciseGroup";
import { WorkoutDto } from "@/models/workoutDto";
import { WorkoutTimer } from "../common/WorkoutTimer";
import NotificationModal from "../common/NotificationModal";
import { FAILED_POST_STORAGE_KEY, STORAGE_KEY } from "@/constants/storagekeys";
import CustomAppBar from "../global/CustomAppBar";
import { postWorkoutWithTimeout } from "@/data/functions/postWorkoutWithTimeout";
interface WorkoutData {
    startTime: Date;
    duration: number;
    exercises: ExerciseGroup[];
}

const MemoizedExerciseList = React.memo(ExerciseGroupList);
const Workout = () => {
    const theme = useAppTheme();
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showExerciseList, setShowExerciseList] = useState(false);
    const [exerciseData, setExerciseData] = useState<ExerciseGroup[]>([]);
    const [willClearOldWorkoutData, setWillClearOldWorkoutData] =
        useState<boolean>(false);
    const timerInterval = useRef<NodeJS.Timeout>();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        if (isRunning) {
            timerInterval.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerInterval.current);
        }
        return () => clearInterval(timerInterval.current);
    }, [isRunning]);

    const handleStartWorkout = async () => {
        setIsRunning(true);
        setStartTime(new Date());
        setShowExerciseList(true);
        setExerciseData([]);
    };

    const handleCancelWorkout = async () => {
        // TODO: probably should add a confirmation modal...
        setIsRunning(false);
        setShowExerciseList(false);
        setElapsedTime(0);
        setStartTime(null);
        setExerciseData([]);
    };
    const handlePauseWorkout = () => {
        setIsRunning(false);
    };

    const handleResumeWorkout = () => {
        setIsRunning(true);
    };

    const handleFinishWorkout = async () => {
        if (!exerciseData || exerciseData.length === 0) {
            setModalVisible(true);
            setModalMessage(
                "Cannot finish workout with no exercises. Please add at least one exercise/set before finishing the workout."
            );
            return;
        }

        setIsRunning(false);
        if (!startTime) return;

        const workoutData: WorkoutData = {
            startTime: startTime,
            duration: elapsedTime,
            exercises: exerciseData,
        };

        try {
            const exerciseSets = workoutData.exercises.flatMap(
                (group) => group.sets
            );

            const workoutDto: WorkoutDto = {
                DateStarted: workoutData.startTime,
                ExerciseSets: exerciseSets,
            };
            // Send to backend
            const result = await postWorkoutWithTimeout(workoutDto);
            if (!result) {
                setModalMessage(
                    "Failed to save workout data to remote server. The data will be held in local storage until it is manually uploaded."
                );
                setModalVisible(true);
            }
            // Reset component state
            setShowExerciseList(false);
            setElapsedTime(0);
            setStartTime(null);
            setExerciseData([]);
        } catch (error) {
            console.error("Error saving workout:", error);
        }
    };

    return (
        <View
            style={{
                ...styles.container,
                backgroundColor: theme.colors.background,
            }}
        >
            <NotificationModal
                message={modalMessage}
                setModalVisibile={setModalVisible}
                isVisible={modalVisible}
            />
            <WorkoutTimer elapsedTime={elapsedTime} />

            <View style={styles.buttonContainer}>
                {!showExerciseList && (
                    <Button onPress={handleStartWorkout}>
                        Start New Workout
                    </Button>
                )}
                {showExerciseList && (
                    <>
                        {isRunning ? (
                            <Button onPress={handlePauseWorkout}>Pause</Button>
                        ) : (
                            <Button onPress={handleResumeWorkout}>
                                Resume
                            </Button>
                        )}
                        <Button
                            onPress={async () => await handleCancelWorkout()}
                        >
                            Cancel
                        </Button>
                        <Button onPress={handleFinishWorkout}>
                            Finish Workout
                        </Button>
                    </>
                )}
            </View>

            {showExerciseList && (
                <MemoizedExerciseList
                    onGroupsChange={setExerciseData}
                    clearOldData={willClearOldWorkoutData}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    timer: {
        fontSize: 32,
        textAlign: "center",
        marginVertical: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
});

export default Workout;
