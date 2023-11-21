import React, { useEffect } from "react";
import styles from "./style.module.css";
import { useForm } from "react-hook-form";
import { userService } from "../../../services/userService";
import {
  CredentialsSchemaType,
  credentialsRegisterSchema,
} from "../../../models/UserCredentials";
import Input from "../../Custom/Input/Input";
import Button from "../../Custom/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import Spinner from "../../Custom/Spinner/Spinner";

const Signup: React.FC = () => {
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsSchemaType>({
    resolver: zodResolver(credentialsRegisterSchema),
  });

  const registerUser = (data: any) => {
    userService.register(data);
  };

  // useEffect(() => {
  //   if (!user) return;
  //   navigate("/");
  // }, [user]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(registerUser)}>
      <h2 className={styles.heading}>Sign Up</h2>
      {/* {error && <div className={styles.errorHeading}>make a propper error</div>} */}
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
        {errors.password && (
          <div className={styles.errorMsg}>{errors.password.message}</div>
        )}
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password validation"
          {...register("validatePassword")}
        />
        {errors.validatePassword && (
          <div className={styles.errorMsg}>
            {errors.validatePassword.message}
          </div>
        )}
      </div>
      <Button theme="primary" type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Sign Up"}
      </Button>
      <div className={styles.footer}>
        <span>Already have an account yet?</span>
        <Link to="/auth/login">Login</Link>
      </div>
    </form>
  );
};

export default Signup;
