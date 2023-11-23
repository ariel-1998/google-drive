import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserCredentials } from "../../../models/UserCredentials";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { store } from "../store";

class UserThunks {
  registerAsync = createAsyncThunk(
    "user/registerAsync",
    async (credentials: UserCredentials) => {
      return await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
    }
  );
  signInAsync = createAsyncThunk(
    "user/signInAsync",
    async (credentials: UserCredentials) => {
      return await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
    }
  );
  resetPasswordAsync = createAsyncThunk(
    "user/resetPasswordAsync",
    async (email: string) => {
      return await sendPasswordResetEmail(auth, email);
    }
  );
  updateEmailAsync = createAsyncThunk(
    "user/updateEmailAsync",
    async (email: string) => {
      const { user } = store.getState().user;
      if (!user) throw new Error("User not logged in.");
      return await verifyBeforeUpdateEmail(user, email);
    }
  );
  updatePasswordAsync = createAsyncThunk(
    "user/updatePasswordAsync",
    async (password: string) => {
      const { user } = store.getState().user;
      if (!user) throw new Error("User not logged in.");
      return await updatePassword(user, password);
    }
  );
  logoutAsync = createAsyncThunk("user/logoutAsync", async () => {
    return await auth.signOut();
  });
}
export const userThunks = new UserThunks();
