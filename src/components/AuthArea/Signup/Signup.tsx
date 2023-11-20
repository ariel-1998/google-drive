import React from "react";
import styles from "./style.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { useForm } from "react-hook-form";
import { userService } from "../../../services/userService";
import { UserCredentials } from "../../../models/UserCredentials";

const Signup: React.FC = () => {
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const { register, handleSubmit } = useForm<UserCredentials>();

  const registerUser = (data: any) => {
    userService.register(data);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(registerUser)}>
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

export default Signup;
