import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { userThunks } from "./userThunks";

type UserState = User | null;

export type Action = {
  status: "pending" | "rejected" | "fulfilled" | "idle";
  error: string | null;
};

type UserStateObj = {
  user: UserState;
  actions: {
    login: Action;
    register: Action;
    passwordReset: Action;
    emailUpdate: Action;
    passwordUpdate: Action;
    logout: Action;
    updateProfileNameAsync: Action;
    updateProfileImageAsync: Action;
  };
};

let initialState = {
  user: null,
  actions: {
    updateProfileImageAsync: { status: "idle", error: null },
    updateProfileNameAsync: { status: "idle", error: null },
    login: { status: "idle", error: null },
    register: { status: "idle", error: null },
    passwordReset: { status: "idle", error: null },
    emailUpdate: { status: "idle", error: null },
    passwordUpdate: { status: "idle", error: null },
    logout: { status: "idle", error: null },
  },
} as UserStateObj;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    changeUser(state, action: PayloadAction<UserState>) {
      state.user = action.payload;
      return state;
    },
    resetAuthStateOnLogout() {
      return initialState;
    },
  },
  extraReducers(builder) {
    //Login
    builder.addCase(signInAsync.pending, (state) => {
      handleStateStatus(state, "pending", "login");
    }),
      builder.addCase(signInAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "login", action.error.message);
      });
    builder.addCase(signInAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "login");
    });
    //Register
    builder.addCase(registerAsync.pending, (state) => {
      handleStateStatus(state, "pending", "register");
    }),
      builder.addCase(registerAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "register", action.error.message);
      });
    builder.addCase(registerAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "register");
    });
    //reset password
    builder.addCase(resetPasswordAsync.pending, (state) => {
      handleStateStatus(state, "pending", "passwordReset");
    }),
      builder.addCase(resetPasswordAsync.rejected, (state, action) => {
        handleStateStatus(
          state,
          "rejected",
          "passwordReset",
          action.error.message
        );
      });
    builder.addCase(resetPasswordAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "passwordReset");
    });
    //update email
    builder.addCase(updateEmailAsync.pending, (state) => {
      handleStateStatus(state, "pending", "emailUpdate");
    }),
      builder.addCase(updateEmailAsync.rejected, (state, action) => {
        handleStateStatus(
          state,
          "rejected",
          "emailUpdate",
          action.error.message
        );
      });
    builder.addCase(updateEmailAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "emailUpdate");
    });

    //update password
    builder.addCase(updatePasswordAsync.pending, (state) => {
      handleStateStatus(state, "pending", "passwordUpdate");
    }),
      builder.addCase(updatePasswordAsync.rejected, (state, action) => {
        handleStateStatus(
          state,
          "rejected",
          "passwordUpdate",
          action.error.message
        );
      });
    builder.addCase(updatePasswordAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "passwordUpdate");
    });
    //logout
    builder.addCase(logoutAsync.pending, (state) => {
      handleStateStatus(state, "pending", "logout");
    }),
      builder.addCase(logoutAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "logout", action.error.message);
      });
    builder.addCase(logoutAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "logout");
    });

    //update profile name
    builder.addCase(updateProfileNameAsync.pending, (state) => {
      handleStateStatus(state, "pending", "updateProfileNameAsync");
    }),
      builder.addCase(updateProfileNameAsync.rejected, (state, action) => {
        handleStateStatus(
          state,
          "rejected",
          "updateProfileNameAsync",
          action.error.message
        );
      });
    builder.addCase(updateProfileNameAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "updateProfileNameAsync");
    });
    //update profile image
    builder.addCase(updateProfileImageAsync.pending, (state) => {
      handleStateStatus(state, "pending", "updateProfileImageAsync");
    }),
      builder.addCase(updateProfileImageAsync.rejected, (state, action) => {
        handleStateStatus(
          state,
          "rejected",
          "updateProfileImageAsync",
          action.error.message
        );
      });
    builder.addCase(updateProfileImageAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "updateProfileImageAsync");
    });
  },
});

export const {
  signInAsync,
  registerAsync,
  resetPasswordAsync,
  updateEmailAsync,
  logoutAsync,
  updatePasswordAsync,
  updateProfileNameAsync,
  updateProfileImageAsync,
} = userThunks;
export const { changeUser, resetAuthStateOnLogout } = userSlice.actions;
export default userSlice.reducer;

export type Status = "pending" | "rejected" | "fulfilled";
type Method =
  | "login"
  | "register"
  | "passwordReset"
  | "emailUpdate"
  | "passwordUpdate"
  | "logout"
  | "updateProfileNameAsync"
  | "updateProfileImageAsync";

export function handleStateStatus( //check if i can combine both functions into 1 in both slices
  // state.actions: T  instead of state
  state: UserStateObj,
  status: Status,
  method: Method,
  error?: string
) {
  switch (status) {
    case "pending": {
      state.actions[method].status = "pending";
      state.actions[method].error = null;
      break;
    }
    case "rejected": {
      state.actions[method].status = "rejected";
      state.actions[method].error = error || "Unknown Error has accured.";
      break;
    }
    case "fulfilled": {
      state.actions[method].error = null;
      state.actions[method].status = "fulfilled";
      break;
    }
    default: {
      state.actions[method].error = null;
      state.actions[method].status = "idle";
    }
  }
}
