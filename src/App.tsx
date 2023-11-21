import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./components/AuthArea/Login/Login";
import { auth } from "./utils/firebaseConfig";
import { changeUser } from "./utils/redux/userRedux/userSlice";
import Signup from "./components/AuthArea/Signup/Signup";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UnauthLayoutContainer from "./components/UnauthedLayout/LayoutContainer/UnauthLayoutContainer";
import ForgotPassword from "./components/AuthArea/ForgotPassword/ForgotPassword";
import { RootState } from "./utils/redux/store";
import Layout from "./components/LayoutArea/Layout/Layout";
import UpdateEmail from "./components/AuthArea/UpdateEmail/UpdateEmail";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(changeUser(user));
    });
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/** Auth Routes */}

        {!user ? (
          <Route path="/auth" Component={UnauthLayoutContainer}>
            <Route path="signup" Component={Signup} />
            <Route path="login" Component={Login} />
            <Route path="password-reset" Component={ForgotPassword} />
          </Route>
        ) : (
          <>
            <Route path="update" Component={UnauthLayoutContainer}>
              <Route path="email" Component={UpdateEmail} />
            </Route>
            <Route Component={Layout}>
              <Route path="/" />
            </Route>
          </>
        )}
        {/** Redirect Route*/}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/auth/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
