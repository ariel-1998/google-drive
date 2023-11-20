import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Login from "./components/AuthArea/Login/Login";
import { auth } from "./utils/firebaseConfig";
import { changeUser } from "./utils/redux/userRedux/userSlice";
import Signup from "./components/AuthArea/Signup/Signup";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(changeUser(user));
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <Login />
      <Signup />
    </div>
  );
}

export default App;
