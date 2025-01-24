import { ExerciseSetDto } from "./exerciseSetDto";

export type WorkoutDto = {
    DateStarted: Date;
    ExerciseSets: ExerciseSetDto[];
};
