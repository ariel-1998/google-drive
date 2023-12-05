import React, { useRef, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import Input from "../../Custom/Input/Input";
import styles from "./style.module.css";
import Button from "../../Custom/Button/Button";
import Spinner from "../../Custom/Spinner/Spinner";
import useFirestoreError from "../../../hooks/useFirestoreError";
import { userService } from "../../../services/userService";
import useResetActionState from "../../../hooks/useResetActionState";

const DeleteAccount: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { isLoading, error } = useSelector(
    (state: RootState) => state.user.actions.deleteAccount
  );
  const passwordRef = useRef<HTMLInputElement | null>(null);
  useResetActionState({
    action: "user",
    actionType: "deleteAccount",
  });

  useFirestoreError(error);
  const deleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordField = passwordRef.current;
    if (!user || !user.email || !passwordField) return;
    const passVal = passwordField.value;
    if (!passVal.trim()) return;

    userService.deleteUserAccount(passVal);
  };

  return (
    <form className={styles.form} onSubmit={deleteAccount}>
      <h2 className={styles.heading}>Delete Account</h2>
      <Input type="password" placeholder="password..." ref={passwordRef} />
      <Button theme="danger" type="submit" disabled={isLoading}>
        {isLoading ? <Spinner /> : "Delete Account"}
      </Button>
    </form>
  );
};

export default DeleteAccount;
