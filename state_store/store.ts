import {
    combineReducers,
    configureStore,
    UnknownAction,
} from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";

enum gainsSqlActionSpecifier {
    INIT,
    RESET,
}

type GainsSqlActionObject = {
    type: gainsSqlActionSpecifier;
    payload: SQLite.SQLiteDatabase;
};
interface GainsState {
    sqliteDb: SQLite.SQLiteDatabase | null;
}
const initialGainsState: GainsState = {
    sqliteDb: null,
};

// cool, I hate this
const dbReducer = (state = initialGainsState, action: any): GainsState => {
    // if we somehow pass something else (or nothing) into the db state,
    // just dump out of the reducer
    if (!(action.payload instanceof SQLite.SQLiteDatabase)) {
        return state;
    }
    switch (action.type) {
        case "INIT":
            return { ...state, sqliteDb: action.payload };
        default:
            return state;
    }
};
const rootReducer = combineReducers({ db: dbReducer });
const store = configureStore({
    reducer: dbReducer,
});

export { store, gainsSqlActionSpecifier, GainsSqlActionObject };
