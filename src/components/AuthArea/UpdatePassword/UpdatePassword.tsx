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
import useFirestoreError from "../../../hooks/useFirestoreError";
import useResetActionState from "../../../hooks/useResetActionState";

type PasswordResetType = z.infer<typeof updatePasswordSchema>;

const UpdatePassword: React.FC = () => {
  const { error, isLoading, isSuccessful } = useSelector(
    (state: RootState) => state.user.actions.passwordUpdate
  );
  useFirestoreError(error);
  useResetActionState({
    action: "user",
    actionType: "passwordUpdate",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetType>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const submitUpdatePassword = (data: PasswordResetType) => {
    userService.updatePassword({
      newPassword: data.newPassword,
      currentPassword: data.oldPassword,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submitUpdatePassword)}>
      <h2 className={styles.heading}>Update Password</h2>

      {isSuccessful && (
        <div className={styles.successHeading}>
          Successfuly updated password
        </div>
      )}

      <div>
        <Input
          type="password"
          placeholder="Old password..."
          {...register("oldPassword")}
        />
        {errors.oldPassword && (
          <div className={styles.errorMsg}>{errors.oldPassword.message}</div>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="New password..."
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <div className={styles.errorMsg}>{errors.newPassword.message}</div>
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
        <Button theme="authPrimary" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Update Password"}
        </Button>
      </div>
    </form>
  );
};

export default UpdatePassword;
