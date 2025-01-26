import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import ExerciseGroupList from "../exercise/ExerciseGroupList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "@/app/_layout";
import { postWorkout } from "@/data/functions/postWorkout";
import { ExerciseGroup } from "@/models/exerciseGroup";
import { WorkoutDto } from "@/models/workoutDto";
import { WorkoutTimer } from "../common/WorkoutTimer";
import NotificationModal from "../common/NotificationModal";
interface WorkoutData {
    startTime: Date;
    duration: number;
    exercises: ExerciseGroup[];
}
const STORAGE_KEY = "@exercise_groups";
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

    const formatTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStartWorkout = async () => {
        setIsRunning(true);
        setStartTime(new Date());
        setShowExerciseList(true);
        await AsyncStorage.removeItem("workouts");
        setExerciseData([]);
    };

    const handleCancelWorkout = async () => {
        // TODO: probably should add a confirmation modal...
        await AsyncStorage.removeItem(STORAGE_KEY);
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
            // Save to AsyncStorage
            const workouts = await AsyncStorage.getItem("workouts");
            const existingWorkouts = workouts ? JSON.parse(workouts) : [];
            existingWorkouts.push(workoutData);
            await AsyncStorage.setItem(
                "workouts",
                JSON.stringify(existingWorkouts)
            );
            const exerciseSets = workoutData.exercises.flatMap(
                (group) => group.sets
            );
            console.log(exerciseSets);
            const workoutDto: WorkoutDto = {
                DateStarted: workoutData.startTime,
                ExerciseSets: exerciseSets,
            };
            // Send to backend
            await postWorkout(workoutDto);

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
                message='Cannot finish workout with no exercises. Please add at least one exercise/set before finishing the workout.'
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
