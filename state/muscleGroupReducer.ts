import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExerciseState, MuscleGroupState } from "./stateLib";
import { Exercise } from "@/models/exerciseModels";
import { produce } from "immer";
import { RootState } from "./store";

const initialState: MuscleGroupState[] = [];
export const muscleGroupSlice = createSlice({
    name: "musclegroup",
    initialState,
    reducers: {
        addMuscleGroup: (
            state: MuscleGroupState[],
            action: PayloadAction<MuscleGroupState>
        ): void => {
            state.push(action.payload);
        },
        loadMuscleGroups: (
            state: MuscleGroupState[],
            action: PayloadAction<MuscleGroupState[]>
        ): MuscleGroupState[] => {
            return action.payload;
        },
    },
});

export const { addMuscleGroup, loadMuscleGroups } = muscleGroupSlice.actions;

export const selectExercise = (state: RootState) => state.exercise;

export default muscleGroupSlice.reducer;
