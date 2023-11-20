import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userRedux/userSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export const useAppDispatch = () => useDispatch();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
