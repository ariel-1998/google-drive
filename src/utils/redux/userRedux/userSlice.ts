import { PayloadAction, SerializedError, createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { userThunks } from "./userThunks";

type UserState = User | null;

export type Action = {
  isLoading: boolean;
  isError: boolean;
  isSuccessful: boolean;
  error: SerializedError | null;
};
export type UserActions = Record<AuthMethods, Action>;

export type UserStateObj = {
  user: UserState;
  actions: UserActions;
};

export const initialAction: Action = {
  error: null,
  isError: false,
  isLoading: false,
  isSuccessful: false,
};

let initialState = {
  user: null,
  actions: {
    updateProfileImageAsync: { ...initialAction },
    updateProfileNameAsync: { ...initialAction },
    login: { ...initialAction },
    register: { ...initialAction },
    passwordReset: { ...initialAction },
    emailUpdate: { ...initialAction },
    passwordUpdate: { ...initialAction },
    logout: { ...initialAction },
    deleteAccount: { ...initialAction },
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
    resetUserActionState(state, action: PayloadAction<AuthMethods>) {
      const method = action.payload;
      state.actions[method] = { ...initialAction };
      console.log(initialAction);
      return state;
    },
  },
  extraReducers(builder) {
    //Login
    builder.addCase(signInAsync.pending, (state) => {
      handleStateStatus(state, "pending", "login");
    }),
      builder.addCase(signInAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "login", action.error);
      });
    builder.addCase(signInAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "login");
    });
    //Register
    builder.addCase(registerAsync.pending, (state) => {
      handleStateStatus(state, "pending", "register");
    }),
      builder.addCase(registerAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "register", action.error);
      });
    builder.addCase(registerAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "register");
    });
    //reset password
    builder.addCase(resetPasswordAsync.pending, (state) => {
      handleStateStatus(state, "pending", "passwordReset");
    }),
      builder.addCase(resetPasswordAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "passwordReset", action.error);
      });
    builder.addCase(resetPasswordAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "passwordReset");
    });
    //update email
    builder.addCase(updateEmailAsync.pending, (state) => {
      handleStateStatus(state, "pending", "emailUpdate");
    }),
      builder.addCase(updateEmailAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "emailUpdate", action.error);
      });
    builder.addCase(updateEmailAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "emailUpdate");
    });

    //update password
    builder.addCase(updatePasswordAsync.pending, (state) => {
      handleStateStatus(state, "pending", "passwordUpdate");
    }),
      builder.addCase(updatePasswordAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "passwordUpdate", action.error);
      });
    builder.addCase(updatePasswordAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "passwordUpdate");
    });
    //logout
    builder.addCase(logoutAsync.pending, (state) => {
      handleStateStatus(state, "pending", "logout");
    }),
      builder.addCase(logoutAsync.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "logout", action.error);
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
          action.error
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
          action.error
        );
      });
    builder.addCase(updateProfileImageAsync.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "updateProfileImageAsync");
    });
    //delete account
    builder.addCase(deleteAccount.pending, (state) => {
      handleStateStatus(state, "pending", "deleteAccount");
    }),
      builder.addCase(deleteAccount.rejected, (state, action) => {
        handleStateStatus(state, "rejected", "deleteAccount", action.error);
      });
    builder.addCase(deleteAccount.fulfilled, (state) => {
      handleStateStatus(state, "fulfilled", "deleteAccount");
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
  deleteAccount,
} = userThunks;
export const { changeUser, resetAuthStateOnLogout, resetUserActionState } =
  userSlice.actions;
export default userSlice.reducer;

export type Status = "pending" | "rejected" | "fulfilled";
export type AuthMethods =
  | "login"
  | "register"
  | "passwordReset"
  | "emailUpdate"
  | "passwordUpdate"
  | "logout"
  | "updateProfileNameAsync"
  | "updateProfileImageAsync"
  | "deleteAccount";

export function handleStateStatus( //check if i can combine both functions into 1 in both slices
  // state.actions: T  instead of state
  state: UserStateObj,
  status: Status,
  method: AuthMethods,
  error?: SerializedError
) {
  switch (status) {
    case "pending": {
      state.actions[method].isLoading = true;
      state.actions[method].isError = false;
      state.actions[method].error = null;
      break;
    }
    case "rejected": {
      state.actions[method].isLoading = false;
      state.actions[method].isError = true;
      state.actions[method].error = error || {
        message: "Unknown Error has accured.",
      };
      break;
    }
    case "fulfilled": {
      state.actions[method].error = null;
      state.actions[method].isSuccessful = true;
      state.actions[method].isLoading = false;
      state.actions[method].isError = false;
      break;
    }

    default: {
      state.actions[method] = { ...initialAction };
    }
  }
}
