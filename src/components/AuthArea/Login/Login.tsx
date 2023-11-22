import { useForm } from "react-hook-form";
import styles from "./style.module.css";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import {
  CredentialsSchemaType,
  UserCredentials,
  credentialsSchema,
} from "../../../models/UserCredentials";
import { userService } from "../../../services/userService";
import Input from "../../Custom/Input/Input";
import Button from "../../Custom/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../Custom/Spinner/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    actions: {
      login: { error, status },
    },
  } = useSelector((state: RootState) => state.user);

  const loading = status === "pending";

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

  useEffect(() => {
    if (!user) return;
    navigate("/");
  }, [user]);

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
      <Button theme="primary" type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Log In"}
      </Button>
      <div className={styles.footer}>
        <span>Dont have an account yet?</span>
        <Link to="/auth/signup">Sign Up</Link>
      </div>
    </form>
  );
};

export default Login;
