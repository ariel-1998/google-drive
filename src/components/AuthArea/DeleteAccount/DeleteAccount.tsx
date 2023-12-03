import React, { useRef, useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import Input from "../../Custom/Input/Input";
import styles from "./style.module.css";
import Button from "../../Custom/Button/Button";
import Spinner from "../../Custom/Spinner/Spinner";
import useFirestoreError from "../../../hooks/useFirestoreError";
import { SerializedError } from "@reduxjs/toolkit";

const DeleteAccount: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SerializedError | null>(null);
  useFirestoreError(error);

  const deleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordField = passwordRef.current;
    if (!user || !user.email || !passwordField) return;
    const passVal = passwordField.value;
    if (!passVal.trim()) return;

    const credential = EmailAuthProvider.credential(user.email, passVal);

    try {
      setError(null);
      setLoading(true);
      await reauthenticateWithCredential(user, credential);
      await user.delete();
    } catch (error) {
      setError(error as SerializedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={deleteAccount}>
      <h2 className={styles.heading}>Delete Account</h2>
      <Input type="password" placeholder="password..." ref={passwordRef} />
      <Button theme="danger" type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Delete Account"}
      </Button>
    </form>
  );
};

export default DeleteAccount;
