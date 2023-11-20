import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserCredentials } from "../../../models/UserCredentials";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

class UserThunks {
  signInAsync = createAsyncThunk(
    "user/signInAsync",
    async (credentials: UserCredentials, _) => {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
    }
  );
  registerAsync = createAsyncThunk(
    "user/registerAsync",
    async (credentials: UserCredentials, _) => {
      await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
    }
  );
}

export const userThunks = new UserThunks();
