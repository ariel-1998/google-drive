import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./components/AuthArea/Login/Login";
import { auth } from "./utils/firebaseConfig";
import { changeUser } from "./utils/redux/userRedux/userSlice";
import Signup from "./components/AuthArea/Signup/Signup";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import UnauthLayoutContainer from "./components/UnauthedLayoutArea/LayoutContainer/UnauthLayoutContainer";
import ForgotPassword from "./components/AuthArea/ForgotPassword/ForgotPassword";
import { RootState } from "./utils/redux/store";
import Layout from "./components/LayoutArea/Layout/Layout";
import UpdateEmail from "./components/AuthArea/UpdateEmail/UpdateEmail";
import UpdatePassword from "./components/AuthArea/UpdatePassword/UpdatePassword";
import Dashboard from "./components/LayoutArea/Dashboard/Dashboard";
import { ROOT_FOLDER } from "./utils/redux/foldersRedux/foldersSlice";
import UpdateProfile from "./components/AuthArea/UpdateProfile/UpdateProfile";
import FilesProvider from "./context/FilesProvider";
import DeleteAccount from "./components/AuthArea/DeleteAccount/DeleteAccount";
import Logout from "./components/AuthArea/Logout/Logout";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(changeUser(user));
      //when user is defined setting the rootFolderId = user.uid
      ROOT_FOLDER.id = user?.uid || "";
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
          <Route Component={FilesProvider}>
            <Route Component={Layout}>
              {/** files routes */}

              <Route path="/" Component={Dashboard} />
              <Route path="/folder/:folderId" Component={Dashboard} />
              {/** user routes */}
              <Route path="/update">
                <Route path="email" Component={UpdateEmail} />
                <Route path="password" Component={UpdatePassword} />
                <Route path="profile" Component={UpdateProfile} />
              </Route>
              <Route path="/delete-account" Component={DeleteAccount} />
            </Route>
            <Route path="/logout" Component={Logout} />
          </Route>
        )}
        {/** Redirect Route*/}
        <Route path="*" Component={RedirectRoute} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

const RedirectRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
    else navigate("/auth/login", { replace: true });
  }, [navigate]);

  return null;
};
