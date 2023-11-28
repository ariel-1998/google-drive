import React from "react";
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
  const { error, status } = useSelector(
    (state: RootState) => state.user.actions.logout
  );

  const loading = status === "pending";

  const logout = async () => {
    if (loading) return;
    userService.logout().then(() => {
      !!callback && callback();
    });
  };

  return (
    <div className={`${styles.logout} ${className}`} onClick={logout}>
      Logout <FaSignOutAlt />
    </div>
  );
};

export default Logout;
