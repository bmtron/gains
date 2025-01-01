import {
    combineReducers,
    configureStore,
    UnknownAction,
} from "@reduxjs/toolkit";

const initialGainsState = {
    sqliteDb: null,
};

// cool, I hate this
const dbReducer = (state = initialGainsState, action: any) => {
    // if we somehow pass something else (or nothing) into the db state,
    // just dump out of the reducer
    // if (!(action.payload instanceof SQLite.SQLiteDatabase)) {
    //     return state;
    // }
    // switch (action.type) {
    //     case "INIT":
    //         return { ...state, sqliteDb: action.payload };
    //     default:
    //         return state;
    // }
    return state;
};
const rootReducer = combineReducers({ db: dbReducer });
const store = configureStore({
    reducer: dbReducer,
});

export { store };
