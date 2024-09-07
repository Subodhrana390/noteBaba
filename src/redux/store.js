import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./userSlice";
import notesSlice from "./notesSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const userpersistedReducer = persistReducer(persistConfig, userSlice);


export const store = configureStore({
  reducer: userpersistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
