import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import Input from "../../Custom/Input/Input";
import Button from "../../Custom/Button/Button";
import Spinner from "../../Custom/Spinner/Spinner";
import { emailSchema } from "../../../models/UserCredentials";
import { userService } from "../../../services/userService";
import { RootState } from "../../../utils/redux/store";
import { useSelector } from "react-redux";
import useFirestoreError from "../../../hooks/useFirestoreError";
import { toastService } from "../../../services/toastService";
import { auth } from "../../../utils/firebaseConfig";

const UpdateEmail: React.FC = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { status, error } = useSelector(
    (state: RootState) => state.user.actions.emailUpdate
  );
  useFirestoreError(error);

  const fulfilled = status === "fulfilled";
  const loading = status === "pending";

  const submitUpdateEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current || !passwordRef.current) return;
    try {
      const password = passwordRef.current.value;
      if (!password) throw new Error("Password is required.");
      const email = emailRef.current.value;
      emailSchema.parse(email);
      userService.updateEmail({ email, password });
    } catch (error) {
      toastService.error(error as string);
    }
  };

  return (
    <form className={styles.form} onSubmit={submitUpdateEmail}>
      <h2 className={styles.heading}>Update Email</h2>
      {fulfilled && (
        <>
          <div className={styles.successHeading}>Check Mail Box</div>
          <div className={styles.footer}>
            Note: Updating Email will Log you out
          </div>
        </>
      )}
      <div>
        New Email:
        <Input type="text" placeholder="Email..." ref={emailRef} />
      </div>
      <div>
        Current Password:
        <Input type="password" placeholder="Password..." ref={passwordRef} />
      </div>
      <div className={styles.footerWrapper}>
        <Button theme="secondary" type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Update Email"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateEmail;
