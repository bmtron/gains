export default interface ExerciseSet {
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
