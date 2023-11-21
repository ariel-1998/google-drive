import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserCredentials } from "../../../models/UserCredentials";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { store } from "../store";

class UserThunks {
  registerAsync = createAsyncThunk(
    "user/registerAsync",
    async (credentials: UserCredentials) => {
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
    }
  );
  signInAsync = createAsyncThunk(
    "user/signInAsync",
    async (credentials: UserCredentials) => {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
    }
  );
  resetPasswordAsync = createAsyncThunk(
    "user/resetPasswordAsync",
    async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    }
  );
  updateEmailAsync = createAsyncThunk(
    "user/updateEmailAsync",
    async (newEmail: string) => {
      const { user } = store.getState().user;
      if (!user) throw new Error("User not logged in.");
      await verifyBeforeUpdateEmail(user, newEmail);
    }
  );
}

export const userThunks = new UserThunks();
