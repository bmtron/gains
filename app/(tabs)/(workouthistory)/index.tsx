import { useAppTheme } from "@/app/_layout";
import ExerciseGroupList from "@/components/exercise/ExerciseGroupList";
import Workout from "@/models/workout";
import getAllItems from "@/data/functions/getAllItems";
import { Exercise } from "@/models/exerciseModels";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkoutHistory from "@/components/workout/WorkoutHistory";
import { WorkoutDto } from "@/models/workoutDto";
import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { View, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";

const WorkoutHistoryBase = () => {
    const theme = useAppTheme();
    const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
    const [workouts, setWorkouts] = useState<WorkoutDto[]>();
    const [exercisesLoaded, setExercisesLoaded] = useState(false);
    const [exerciseSetsLoaded, setExerciseSetsLoaded] = useState(false);
    const [exerciseSets, setExerciseSets] = useState<ExerciseSetDto[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    useEffect(() => {
        const getAllExercises = async () => {
            const exercises = await getAllItems<Exercise[]>("/exercise");
            setExerciseList(exercises);
            setExercisesLoaded(true);
        };
        getAllExercises();
    }, []);
    useEffect(() => {
        if (!exercisesLoaded) return;
        const getExerciseSets = async () => {
            const exerciseSets = await getAllItems<ExerciseSetDto[]>(
                "/exerciseset/dto"
            );
            setExerciseSets(exerciseSets);
            setExerciseSetsLoaded(true);
        };
        getExerciseSets();
    }, [exercisesLoaded]);
    useEffect(() => {
        if (!exerciseSetsLoaded) return;

        const getAllWorkouts = async () => {
            const workoutDtos = await getWorkoutData();
            setWorkouts(workoutDtos);
        };
        getAllWorkouts();
    }, [exerciseSetsLoaded]);

    const getWorkoutData = async (): Promise<WorkoutDto[]> => {
        const workoutHistory = await getAllItems<Workout[]>("/workout");
        const workoutDtos = workoutHistory.map((w) => {
            const dto: WorkoutDto = {
                DateStarted: w.datestarted,
                ExerciseSets: exerciseSets.filter(
                    (es) =>
                        es.workoutid !== undefined &&
                        es.workoutid === w.workoutid
                ),
            };
            return dto;
        });
        workoutDtos.sort(
            (a, b) =>
                new Date(b.DateStarted).getTime() -
                new Date(a.DateStarted).getTime()
        );
        return workoutDtos;
    };
    const handleRefresh = async () => {
        setIsRefreshing(true);
        const workoutDtos = await getWorkoutData();
        setWorkouts(workoutDtos);
        setIsRefreshing(false);
    };
    const refreshButton = (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 8,
            }}
        >
            {isRefreshing ? (
                <ActivityIndicator size='small' />
            ) : (
                <IconButton icon='refresh' size={24} onPress={handleRefresh} />
            )}
        </View>
    );
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            {refreshButton}
            {exerciseList && workouts && (
                <WorkoutHistory
                    exerciseList={exerciseList}
                    workouts={workouts}
                />
            )}
        </SafeAreaView>
    );
};

export default WorkoutHistoryBase;
