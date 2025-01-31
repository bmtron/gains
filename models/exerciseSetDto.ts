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
