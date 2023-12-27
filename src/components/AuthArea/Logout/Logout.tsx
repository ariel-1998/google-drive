import React, { useEffect } from "react";
import { userService } from "../../../services/userService";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import useFirestoreError from "../../../hooks/useFirestoreError";
import { useNavigate } from "react-router-dom";
import useResetActionState from "../../../hooks/useResetActionState";

const Logout: React.FC = () => {
  const { error, isLoading } = useSelector(
    (state: RootState) => state.user.actions.logout
  );
  const navigate = useNavigate();

  useFirestoreError(error);

  useResetActionState({
    action: "user",
    actionType: "logout",
  });

  useEffect(() => {
    if (isLoading) return;
    userService.logout();
  }, []);

  useEffect(() => {
    if (!error) return;
    navigate("/");
  }, [error]);

  return null;
};

export default Logout;
