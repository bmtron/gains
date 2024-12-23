import { configureStore, UnknownAction } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: function (state: any, action: UnknownAction) {
    return state;
  },
});

export default store;
