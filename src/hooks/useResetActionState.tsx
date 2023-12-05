import { useEffect } from "react";
import {
  AuthMethods,
  resetUserActionState,
} from "../utils/redux/userRedux/userSlice";
import {
  FolderMethods,
  resetFolderActionState,
} from "../utils/redux/foldersRedux/foldersSlice";
import { useDispatch } from "react-redux";

type UserAction = {
  action: "user";
  actionType: AuthMethods;
};

type FolderAction = {
  action: "folder";
  actionType: FolderMethods;
};

type UseResetActionStateProps = UserAction | FolderAction;

const useResetActionState = (actions: UseResetActionStateProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const actionResetFn =
      actions.action === "folder"
        ? () => dispatch(resetFolderActionState(actions.actionType))
        : () => dispatch(resetUserActionState(actions.actionType));

    return () => {
      actionResetFn();
    };
  }, []);
  return null;
};

export default useResetActionState;
