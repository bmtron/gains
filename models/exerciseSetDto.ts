export interface ExerciseSetDto {
    exerciseid: number;
    weight: number;
    weightunitlookupid: number;
    repetitions: number;
    estimatedrpe: number;
    dateadded?: Date | undefined;
    workoutid?: number;
}
