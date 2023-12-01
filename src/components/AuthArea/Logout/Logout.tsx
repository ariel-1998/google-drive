import React, { useEffect } from "react";
import { userService } from "../../../services/userService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import styles from "./style.module.css";
import { FaSignOutAlt } from "react-icons/fa";
import { resetAuthStateOnLogout } from "../../../utils/redux/userRedux/userSlice";
import { resetFolderStateOnLogout } from "../../../utils/redux/foldersRedux/foldersSlice";
import { toastService } from "../../../services/toastService";
import useFirestoreError from "../../../hooks/useFirestoreError";

type LogoutProps = {
  className?: string;
  callback?: () => void;
};

const Logout: React.FC<LogoutProps> = ({ className, callback }) => {
  const { error, status } = useSelector(
    (state: RootState) => state.user.actions.logout
  );
  useFirestoreError(error);
  const dispatch = useDispatch();

  const loading = status === "pending";
  const fulfilled = status === "pending";

  const logout = async () => {
    if (loading) return;
    userService.logout().then(() => {
      !!callback && callback();
    });
  };

  useEffect(() => {
    if (!fulfilled) return;
    dispatch(resetAuthStateOnLogout());
    dispatch(resetFolderStateOnLogout());
  }, [fulfilled]);

  return (
    <div className={`${styles.logout} ${className}`} onClick={logout}>
      Logout <FaSignOutAlt />
    </div>
  );
};

export default Logout;
