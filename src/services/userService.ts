import { UserCredentials } from "../models/UserCredentials";
import { store } from "../utils/redux/store";
import {
  registerAsync,
  resetPasswordAsync,
  signInAsync,
  updateEmailAsync,
} from "../utils/redux/userRedux/userSlice";

class UserService {
  login(credentials: UserCredentials) {
    store.dispatch(signInAsync(credentials));
  }
  register(credentials: UserCredentials) {
    store.dispatch(registerAsync(credentials));
  }
  passwordReset(email: string) {
    store.dispatch(resetPasswordAsync(email));
  }
  updateEmail(newEmail: string) {
    store.dispatch(updateEmailAsync(newEmail));
  }
  updatePassword() {}
}

export const userService = new UserService();
