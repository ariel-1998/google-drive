import { UserCredentials } from "../models/UserCredentials";
import { store } from "../utils/redux/store";
import {
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

  updateEmail(email: string) {
    store.dispatch(updateEmailAsync(email));
  }

  updatePassword(password: string) {
    store.dispatch(updatePasswordAsync(password));
  }

  updateName(name: string) {
    store.dispatch(updateProfileNameAsync(name));
  }

  updateProfileImage(url: string) {
    store.dispatch(updateProfileImageAsync(url));
  }
}

export const userService = new UserService();
