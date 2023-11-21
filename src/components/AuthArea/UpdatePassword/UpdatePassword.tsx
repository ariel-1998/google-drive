import React from "react";
import styles from "./style.module.css";
import Input from "../../Custom/Input/Input";
import Button from "../../Custom/Button/Button";
import Spinner from "../../Custom/Spinner/Spinner";
import { updatePasswordSchema } from "../../../models/UserCredentials";
import { userService } from "../../../services/userService";
import { RootState } from "../../../utils/redux/store";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type PasswordResetType = z.infer<typeof updatePasswordSchema>;

const UpdatePassword: React.FC = () => {
  const {
    actions: {
      passwordUpdate: { loading, fulfilled, error },
    },
  } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetType>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const submitUpdatePassword = (data: PasswordResetType) => {
    console.log(data);
    userService.updatePassword(data.password);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submitUpdatePassword)}>
      <h2 className={styles.heading}>Update Password</h2>

      {/* {(!!error ) && (
          <div className={styles.errorHeading}>
            {error ? error : userStateError}
          </div>
        )} */}

      {fulfilled && (
        <div className={styles.successHeading}>
          Successfuly updated password
        </div>
      )}

      <div>
        <Input
          type="password"
          placeholder="Password..."
          {...register("password")}
        />
        {errors.password && (
          <div className={styles.errorMsg}>{errors.password.message}</div>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="verify password..."
          {...register("validatePassword")}
        />
        {errors.validatePassword && (
          <div className={styles.errorMsg}>
            {errors.validatePassword.message}
          </div>
        )}
      </div>

      <div className={styles.footerWrapper}>
        <Button theme="primary" type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

export default UpdatePassword;
