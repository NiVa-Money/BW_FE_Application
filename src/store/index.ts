/* eslint-disable */

import { configureStore } from "@reduxjs/toolkit";
import botProfileReducers from "./reducers/botReducers";


// Create the store with proper typing
export function makeStore() {
  return configureStore({
    reducer: {
        bot: botProfileReducers,
    },
  });
}

export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;