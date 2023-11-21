import React, { useState, FormEvent, useRef } from "react";
import { emailSchema } from "../../../models/UserCredentials";
import styles from "./style.module.css";
import Input from "../../Custom/Input/Input";
import Button from "../../Custom/Button/Button";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { userService } from "../../../services/userService";
import Spinner from "../../Custom/Spinner/Spinner";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement | null>(null);
  const {
    actions: {
      passwordReset: { error: userStateError, fulfilled, loading },
    },
  } = useSelector((state: RootState) => state.user);
  const submitResetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current) return;
    try {
      setError("");
      const email = emailRef.current.value;
      emailSchema.parse(email);
      userService.passwordReset(email);
    } catch (error) {
      setError("Invalid Email.");
    }
  };

  return (
    <form className={styles.form} onSubmit={submitResetPassword}>
      <h2 className={styles.heading}>Reset Password</h2>
      {(!!error || !!userStateError) && (
        <div className={styles.errorHeading}>
          {error ? error : userStateError}
        </div>
      )}
      {fulfilled && <div className={styles.successHeading}>Check Mail Box</div>}
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
