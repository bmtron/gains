import { ExerciseSetDto } from "./exerciseSetDto";
import { WeightUnit } from "./weightUnit";

export interface ExerciseGroup {
    exerciseid: number;
    exerciselocalid: number;
    name: string;
    sets: ExerciseSetDto[];
    weightUnit?: WeightUnit; // Make weightUnit optional
}
