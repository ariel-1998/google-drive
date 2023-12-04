import { UpdatePassword, UserCredentials } from "../models/UserCredentials";
import { store } from "../utils/redux/store";
import {
  deleteAccount,
  // deleteUserAsync,
  logoutAsync,
  registerAsync,
  resetPasswordAsync,
  signInAsync,
  updateEmailAsync,
  updatePasswordAsync,
  updateProfileImageAsync,
  updateProfileNameAsync,
} from "../utils/redux/userRedux/userSlice";

class UserService {
  register(credentials: UserCredentials) {
    store.dispatch(registerAsync(credentials));
  }

  login(credentials: UserCredentials) {
    store.dispatch(signInAsync(credentials));
  }

  async logout() {
    return store.dispatch(logoutAsync());
  }

  passwordReset(email: string) {
    store.dispatch(resetPasswordAsync(email));
  }

  updateEmail(credentials: UserCredentials) {
    store.dispatch(updateEmailAsync(credentials));
  }

  updatePassword(passwords: UpdatePassword) {
    store.dispatch(updatePasswordAsync(passwords));
  }

  updateName(name: string) {
    store.dispatch(updateProfileNameAsync(name));
  }

  updateProfileImage(url: string) {
    store.dispatch(updateProfileImageAsync(url));
  }

  deleteUserAccount(password: string) {
    store.dispatch(deleteAccount(password));
  }
}

export const userService = new UserService();
