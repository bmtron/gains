import { ExerciseSetDto } from "./exerciseSetDto";

export type WorkoutDto = {
    WorkoutLocalId?: number;
    DateStarted: Date;
    ExerciseSets: ExerciseSetDto[];
};
