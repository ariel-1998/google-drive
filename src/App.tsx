import { useEffect, useState } from "react";
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
import UpdatePassword from "./components/AuthArea/UpdatePassword/UpdatePassword";
import Dashboard from "./components/LayoutArea/Dashboard/Dashboard";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(changeUser(user));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return loading ? (
    "loading..."
  ) : (
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
            {/* <Route path="/update" Component={UnauthLayoutContainer}>
              <Route path="email" Component={UpdateEmail} />
              <Route path="password" Component={UpdatePassword} />
            </Route> */}
            <Route Component={Layout}>
              <Route path="/" Component={Dashboard} />
              <Route path="/folder/:folderId" Component={Dashboard} />
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
