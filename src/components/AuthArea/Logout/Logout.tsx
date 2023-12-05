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
import { useNavigate } from "react-router-dom";
import useResetActionState from "../../../hooks/useResetActionState";

const Logout: React.FC = () => {
  const { error, isLoading, isSuccessful } = useSelector(
    (state: RootState) => state.user.actions.logout
  );
  useFirestoreError(error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useResetActionState({
    action: "user",
    actionType: "logout",
  });

  const logout = async () => {
    if (isLoading) return;
    userService.logout();
  };

  useEffect(() => {
    logout();
  }, []);

  useEffect(() => {
    if (!isSuccessful) return;
    dispatch(resetAuthStateOnLogout());
    dispatch(resetFolderStateOnLogout());
  }, [isSuccessful]);

  useEffect(() => {
    if (!error) return;
    navigate("/");
  }, [error]);

  return null; ///need to delete css and need to return loading circle
};

export default Logout;
