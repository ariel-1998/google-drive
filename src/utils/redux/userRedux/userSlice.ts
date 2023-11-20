import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { userThunks } from "./userThunks";

type UserState = User | null;

type UserStateObj = {
  user: UserState;
  loading: boolean;
  error: string | null;
};

let initialState = {
  user: null,
  loading: false,
  error: null,
} as UserStateObj;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeUser(state, action: PayloadAction<UserState>) {
      state.user = action.payload;
      return state;
    },
  },
  extraReducers(builder) {
    //Login
    builder.addCase(signInAsync.pending, (state) => {
      handleLoadingAndErrorStates(state, "pending");
    }),
      builder.addCase(signInAsync.rejected, (state, action) => {
        handleLoadingAndErrorStates(state, "rejected", action.error.message);
      });
    builder.addCase(signInAsync.fulfilled, (state) => {
      handleLoadingAndErrorStates(state, "fulfilled");
    });
    //Register
    builder.addCase(registerAsync.pending, (state) => {
      handleLoadingAndErrorStates(state, "pending");
    }),
      builder.addCase(registerAsync.rejected, (state, action) => {
        handleLoadingAndErrorStates(state, "rejected", action.error.message);
      });
    builder.addCase(registerAsync.fulfilled, (state) => {
      handleLoadingAndErrorStates(state, "fulfilled");
    });
  },
});

export const { signInAsync, registerAsync } = userThunks;
export const { changeUser } = userSlice.actions;
export default userSlice.reducer;

type Status = "pending" | "rejected" | "fulfilled";
function handleLoadingAndErrorStates(
  state: UserStateObj,
  status: Status,
  error?: string
) {
  switch (status) {
    case "pending": {
      state.loading = true;
      state.error = null;
      break;
    }
    case "rejected": {
      state.loading = false;
      state.error = error || "Unknown Error has accured.";
      break;
    }
    case "fulfilled": {
      state.error = null;
      state.loading = false;
      break;
    }
    default: {
      state.error = null;
      state.loading = false;
    }
  }
}
