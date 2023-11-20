import { useForm } from "react-hook-form";
import styles from "./style.module.css";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { UserCredentials } from "../../../models/UserCredentials";
import { userService } from "../../../services/userService";

const Login: React.FC = () => {
  const { user, error, loading } = useSelector(
    (state: RootState) => state.user
  );
  const { register, handleSubmit } = useForm<UserCredentials>();
  const submitLogin = (data: UserCredentials) => {
    userService.login(data);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(submitLogin)}>
        <>
          <div>{user && !loading && !error && user.email}</div>
          <div>{loading && "loading..."}</div>
          <div>{error && "error!!"}</div>
        </>
        <input type="email" {...register("email")} placeholder="Email..." />
        <input
          type="password"
          placeholder="password"
          {...register("password")}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
