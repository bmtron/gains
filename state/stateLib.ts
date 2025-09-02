import { ExerciseSetDto } from "@/models/exerciseSetDto";
import { WeightUnit } from "@/models/weightUnit";

export interface RootState {
    exercises: ExerciseState[];
    workouts: WorkoutState[];
    exerciseSets: ExerciseSetState[];
    historicalExercises: HistoricalExerciseSetState[];
    exerciseGroup: ExerciseGroupState[];
}

export interface MuscleGroupState {
    musclegroupid: number;
    musclegroupname: string;
}

export interface ExerciseState {
    exerciseid: number;
    musclegroupid: number;
    exercisename: string;
    notes: string;
    dateadded: Date;
    dateupdated: Date | null;
}

export interface WorkoutState {
    workoutid: number;
    datestarted: Date;
    dateadded: Date;
    dateupdated: Date | null;
}

export interface ExerciseSetState {
    exerciseSetId: number;
    exerciseid: number;
    workoutid: number;
    weight: number;
    weightunitlookupid: number;
    repetitions: number;
    estimatedrpe: number;
    dateAdded: Date;
    dateUpdated: Date | null;
}

export interface HistoricalExerciseSetState {
    exerciseId: number;
    date: Date | undefined;
    weightUnit: WeightUnit;
    weight: number;
    reps: number;
    rpe: number;
    workoutid: number | undefined;
}
export interface ExerciseGroupState {
    exerciseid: number;
    exerciselocalid: number;
    name: string;
    sets: ExerciseSetDto[];
    weightUnit?: WeightUnit; // Make weightUnit optional
}
