import {
    combineReducers,
    configureStore,
    UnknownAction,
} from "@reduxjs/toolkit";

import { exerciseSlice } from "./exerciseReducer";
import { muscleGroupSlice } from "./muscleGroupReducer";

export const store = configureStore({
    reducer: {
        exercise: exerciseSlice.reducer,
        musclegroup: muscleGroupSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
