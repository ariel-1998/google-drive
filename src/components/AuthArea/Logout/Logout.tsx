import React, { useEffect } from "react";
import { userService } from "../../../services/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";

const Logout: React.FC = () => {
  const {
    actions: {
      logout: { error, fulfilled, loading },
    },
  } = useSelector((state: RootState) => state.user);
  const logout = async () => {
    userService
      .logout()
      .then(() => console.log("success"))
      .catch(() => console.log("error"));
  };
  return (
    <button onClick={logout} disabled={loading}>
      Logout
    </button>
  );
};

export default Logout;
