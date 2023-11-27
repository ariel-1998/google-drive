import React, { useEffect } from "react";
import { userService } from "../../../services/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import styles from "./style.module.css";
import { FaSignOutAlt } from "react-icons/fa";

type LogoutProps = {
  className?: string;
  callback?: () => void;
};

const Logout: React.FC<LogoutProps> = ({ className, callback }) => {
  const {
    actions: {
      logout: { error, status },
    },
  } = useSelector((state: RootState) => state.user);

  const loading = status === "pending";

  const logout = async () => {
    if (loading) return;
    userService
      .logout()
      .then(() => callback && callback())
      .catch(() => console.log("error"));
  };

  return (
    <div className={`${styles.logout} ${className}`} onClick={logout}>
      Logout <FaSignOutAlt />
    </div>
  );
};

export default Logout;
