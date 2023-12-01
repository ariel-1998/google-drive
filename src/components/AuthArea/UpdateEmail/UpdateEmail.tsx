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

const UpdateEmail: React.FC = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const { status, error } = useSelector(
    (state: RootState) => state.user.actions.emailUpdate
  );
  useFirestoreError(error);

  const fulfilled = status === "fulfilled";
  const loading = status === "pending";

  const submitUpdateEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current) return;
    try {
      const email = emailRef.current.value;
      emailSchema.parse(email);
      userService.updateEmail(email);
    } catch (error) {
      toastService.error("Invalid Email.");
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
      <Input type="text" placeholder="Email..." ref={emailRef} />
      <div className={styles.footerWrapper}>
        <Button theme="secondary" type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Update Email"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateEmail;
