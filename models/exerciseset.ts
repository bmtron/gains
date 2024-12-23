export default interface ExerciseSet {
  exerciseSetId: number;
  exerciseId: number;
  workoutId: number;
  weight: number;
  weightUnitLookupId: number;
  repetitions: number;
  estimatedRpe: number;
  dateAdded: Date;
  dateUpdated: Date | null;
}
