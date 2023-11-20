import { signInWithEmailAndPassword } from "firebase/auth";
import { UserCredentials } from "../models/UserCredentials";
import { auth } from "../utils/firebaseConfig";
import { store } from "../utils/redux/store";
import { registerAsync, signInAsync } from "../utils/redux/userRedux/userSlice";

class UserService {
  login(credentials: UserCredentials) {
    store.dispatch(signInAsync(credentials));
  }
  register(credentials: UserCredentials) {
    store.dispatch(registerAsync(credentials));
  }
}

export const userService = new UserService();
