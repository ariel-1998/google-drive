import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  UpdatePassword,
  UserCredentials,
} from "../../../models/UserCredentials";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { deleteFolderWithChildren } from "../foldersRedux/foldersThunks";
import { ROOT_FOLDER } from "../foldersRedux/foldersSlice";

class UserThunks {
  registerAsync = createAsyncThunk(
    "user/registerAsync",
    async (credentials: UserCredentials) => {
      const data = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      await sendEmailVerification(data.user, {
        url: import.meta.env.VITE_WEBSITE_BASE_URL,
      });
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
    async (credentials: UserCredentials) => {
      const user = auth.currentUser;
      if (!user) throw new Error("Unauthenticated, Please Login again.");

      const { email: newEmail, password } = credentials;
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user!, credential);
      await verifyBeforeUpdateEmail(user, newEmail, {
        url: import.meta.env.VITE_WEBSITE_BASE_URL,
      });
    }
  );
  updatePasswordAsync = createAsyncThunk(
    "user/updatePasswordAsync",
    async (passwords: UpdatePassword) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in!");
      const { newPassword, currentPassword } = passwords;
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );

      if (!user) throw new Error("User not logged in.");
      await reauthenticateWithCredential(user!, credential);
      await updatePassword(user, newPassword);
    }
  );

  logoutAsync = createAsyncThunk("user/logoutAsync", async () => {
    await auth.signOut();
  });

  updateProfileNameAsync = createAsyncThunk(
    "user/updateProfileNameAsync",
    async (name: string) => {
      if (!auth.currentUser) throw new Error("User not logged in!");
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
    }
  );

  updateProfileImageAsync = createAsyncThunk(
    "user/updateProfileImageAsync",
    async (url: string) => {
      if (!auth.currentUser) throw new Error("User not logged in!");
      await updateProfile(auth.currentUser, {
        photoURL: url,
      });
    }
  );

  deleteAccount = createAsyncThunk(
    "user/deleteAccount",
    async (password: string) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in!");
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      await deleteFolderWithChildren(ROOT_FOLDER);
      await user.delete();
    }
  );
}
export const userThunks = new UserThunks();
