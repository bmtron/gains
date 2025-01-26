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

const WorkoutHistoryBase = () => {
    const theme = useAppTheme();
    const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
    const [workouts, setWorkouts] = useState<WorkoutDto[]>();
    const [exercisesLoaded, setExercisesLoaded] = useState(false);
    const [exerciseSetsLoaded, setExerciseSetsLoaded] = useState(false);
    const [exerciseSets, setExerciseSets] = useState<ExerciseSetDto[]>([]);
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
            const workoutHistory = await getAllItems<Workout[]>("/workout");
            console.log(workoutHistory);
            const workoutDtos = workoutHistory.map((w) => {
                const dto: WorkoutDto = {
                    DateStarted: w.datestarted,
                    ExerciseSets: exerciseSets.filter(
                        (es) =>
                            es.workoutid !== undefined &&
                            es.workoutid === w.workoutid
                    ),
                };
                console.log(w.datestarted);
                return dto;
            });
            workoutDtos.sort(
                (a, b) =>
                    new Date(b.DateStarted).getTime() -
                    new Date(a.DateStarted).getTime()
            );
            setWorkouts(workoutDtos);
        };
        getAllWorkouts();
    }, [exerciseSetsLoaded]);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
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
