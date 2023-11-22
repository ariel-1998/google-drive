import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userRedux/userSlice";
import foldersSlice from "./filesRedux/foldersSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    folders: foldersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
