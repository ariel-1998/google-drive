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
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import Spinner from "../../Custom/Spinner/Spinner";
import useFirestoreError from "../../../hooks/useFirestoreError";

//need to validate that there is such email before sgining up
/////////
/////////////
////////////
const Signup: React.FC = () => {
  const { error, status } = useSelector(
    (state: RootState) => state.user.actions.register
  );
  useFirestoreError(error);

  const loading = status === "pending";
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

  return (
    <form className={styles.form} onSubmit={handleSubmit(registerUser)}>
      <h2 className={styles.heading}>Sign Up</h2>
      <div>
        <Input type="text" {...register("email")} placeholder="Email..." />
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
