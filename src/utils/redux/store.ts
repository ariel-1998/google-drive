import { configureStore } from "@reduxjs/toolkit";
import foldersSlice from "./foldersRedux/foldersSlice";
import userSlice from "./userRedux/userSlice";

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
