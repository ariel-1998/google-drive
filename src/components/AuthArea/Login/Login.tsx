import { useForm } from "react-hook-form";
import styles from "./style.module.css";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import {
  CredentialsSchemaType,
  credentialsSchema,
} from "../../../models/UserCredentials";
import { userService } from "../../../services/userService";
import Input from "../../Custom/Input/Input";
import Button from "../../Custom/Button/Button";
import { Link } from "react-router-dom";
import Spinner from "../../Custom/Spinner/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import useFirestoreError from "../../../hooks/useFirestoreError";
import useResetActionState from "../../../hooks/useResetActionState";

const Login: React.FC = () => {
  const { error, isLoading } = useSelector(
    (state: RootState) => state.user.actions.login
  );
  useFirestoreError(error);
  useResetActionState({
    action: "user",
    actionType: "login",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsSchemaType>({
    resolver: zodResolver(credentialsSchema),
  });
  const submitLogin = (data: CredentialsSchemaType) => {
    userService.login({ email: data.email, password: data.password });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submitLogin)}>
      <h2 className={styles.heading}>Log In</h2>

      {(!!errors.password || !!error) && (
        <div className={styles.errorHeading}>
          Email or Password are incorrect
        </div>
      )}
      <div>
        <Input type="email" {...register("email")} placeholder="Email..." />
        {errors.email && (
          <div className={styles.errorMsg}>{errors.email.message}</div>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="password"
          {...register("password")}
        />
        <div className={styles.resetPassword}>
          <Link to="/auth/password-reset">Reset Password</Link>
        </div>
      </div>
      <Button theme="primary" type="submit" disabled={isLoading}>
        {isLoading ? <Spinner /> : "Log In"}
      </Button>
      <div className={styles.footer}>
        <span>Dont have an account yet?</span>
        <Link to="/auth/signup">Sign Up</Link>
      </div>
    </form>
  );
};

export default Login;
