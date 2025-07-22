import HistoricalExerciseSet from "./historicalExerciseSet";
import { WeightUnit } from "./weightUnit";

export interface ExerciseSetDto {
    exerciselocalid: number;
    exerciseserverid: number;
    weight: number;
    weightunitlookupid: number;
    repetitions: number;
    estimatedrpe: number;
    dateadded?: Date | undefined;
    workoutid?: number;
}

export const mapSetsToHistoricalSets = (
    data: ExerciseSetDto[],
    weightUnits: WeightUnit[]
): HistoricalExerciseSet[] => {
    const result = data.map((set) => {
        const temp: HistoricalExerciseSet = {
            workoutid: set.workoutid,
            exerciseId: set.exerciseserverid,
            date: set.dateadded,
            weight: set.weight,
            weightUnit: weightUnits.filter(
                (w) => w.weightunitlookupid === set.weightunitlookupid
            )[0],
            reps: set.repetitions,
            rpe: set.estimatedrpe,
        };

        return temp;
    });
    return result;
};
