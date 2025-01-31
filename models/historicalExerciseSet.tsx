import { WeightUnit } from "./weightUnit";

export default interface HistoricalExerciseSet {
    exerciseId: number;
    date: Date | undefined;
    weightUnit: WeightUnit;
    weight: number;
    reps: number;
    rpe: number;
    workoutid: number | undefined;
}
