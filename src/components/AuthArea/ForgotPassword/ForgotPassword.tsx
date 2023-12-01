import React, { FormEvent, useRef, useEffect } from "react";
import { emailSchema } from "../../../models/UserCredentials";
import styles from "./style.module.css";
import Input from "../../Custom/Input/Input";
import Button from "../../Custom/Button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { userService } from "../../../services/userService";
import Spinner from "../../Custom/Spinner/Spinner";
import { Link } from "react-router-dom";
import { toastService } from "../../../services/toastService";
import useFirestoreError from "../../../hooks/useFirestoreError";

const ForgotPassword: React.FC = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const { status, error } = useSelector(
    (state: RootState) => state.user.actions.passwordReset
  );
  useFirestoreError(error);

  const fulfilled = status === "fulfilled";
  const loading = status === "pending";

  const submitResetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current) return;
    try {
      const email = emailRef.current.value;
      emailSchema.parse(email);
      userService.passwordReset(email);
    } catch (error) {
      toastService.error("Invalid Email.");
    }
  };

  useEffect(() => {
    if (!fulfilled) return;
    //check if code is related to not logged in the log him out
    toastService.success("Check Mail Box for completion.");
  }, [fulfilled]);

  return (
    <form className={styles.form} onSubmit={submitResetPassword}>
      <h2 className={styles.heading}>Reset Password</h2>
      <Input type="text" placeholder="Email..." ref={emailRef} />
      <Button theme="primary" type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Reset Password"}
      </Button>
      <div className={styles.footer}>
        <Link to="/auth/login">Back To Login</Link>
      </div>
    </form>
  );
};

export default ForgotPassword;
