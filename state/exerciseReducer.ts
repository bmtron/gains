import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExerciseState } from "./stateLib";
import { Exercise } from "@/models/exerciseModels";
import { produce } from "immer";
import { RootState } from "./store";

const initialState: ExerciseState[] = [];
export const exerciseSlice = createSlice({
    name: "exercise",
    initialState,
    reducers: {
        addExercise: (
            state: ExerciseState[],
            action: PayloadAction<ExerciseState>
        ): void => {
            state.push(action.payload);
        },
        updateExercise: (
            state: ExerciseState[],
            action: PayloadAction<ExerciseState>
        ): void => {
            const index = state.findIndex(
                (ex) => ex.exerciseid === action.payload.exerciseid
            );
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeExercise: (
            state: ExerciseState[],
            action: PayloadAction<number>
        ) => {
            return state.filter((ex) => ex.exerciseid !== action.payload);
        },
        overwriteExercises: (
            state: ExerciseState[],
            action: PayloadAction<ExerciseState[]>
        ) => {
            return action.payload;
        },
    },
});

export const {
    addExercise,
    updateExercise,
    removeExercise,
    overwriteExercises,
} = exerciseSlice.actions;

export const selectExercise = (state: RootState) => state.exercise;

export default exerciseSlice.reducer;
