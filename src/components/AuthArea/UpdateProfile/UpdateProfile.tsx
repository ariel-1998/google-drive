import React, { useState } from "react";
import styles from "./style.module.css";
import Input from "../../Custom/Input/Input";
import { userService } from "../../../services/userService";
import Button from "../../Custom/Button/Button";
import Spinner from "../../Custom/Spinner/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import {
  UserProfileForm,
  userProfileSchema,
} from "../../../models/UserProfile";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../utils/firebaseConfig";
import useFirestoreError from "../../../hooks/useFirestoreError";
import useStorageError from "../../../hooks/useStorageError";
import useResetActionState from "../../../hooks/useResetActionState";

const UpdateProfile: React.FC = () => {
  const { error, isLoading, isSuccessful } = useSelector(
    (state: RootState) => state.user.actions.updateProfileNameAsync
  );
  useResetActionState({
    action: "user",
    actionType: "updateProfileImageAsync",
  });
  useResetActionState({
    action: "user",
    actionType: "updateProfileNameAsync",
  });
  useFirestoreError(error);
  const storageErrorHandler = useStorageError();

  const { user } = useSelector((state: RootState) => state.user);
  const [postingImage, setPostingImage] = useState(false);
  const loading = isLoading || postingImage;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
  });

  const submitUpdateName = async (data: UserProfileForm) => {
    if (!user?.uid) return;
    if (data.name !== user.displayName) {
      await userService.updateName(data.name || "");
    }
    if (!data.image?.[0]) return;
    setPostingImage(true);
    uploadImageFile(user.uid, data.image[0])
      .then((url) => {
        userService.updateProfileImage(url);
      })
      .catch((e) => storageErrorHandler(e))
      .finally(() => setPostingImage(false));
  };

  const uploadImageFile = async (userId: string, file: File) => {
    const filePath = `profiles/${userId}`;
    const storageRef = ref(storage, filePath);
    const data = await uploadBytes(storageRef, file, {
      customMetadata: { userId },
    });
    const url = await getDownloadURL(data.ref);
    return url;
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submitUpdateName)}>
      <h2 className={styles.heading}>Update Profile</h2>

      {isSuccessful && (
        <div className={styles.successHeading}>Updated Successfully</div>
      )}
      <Input
        type="text"
        placeholder="Update Name..."
        defaultValue={user?.displayName || ""}
        {...register("name")}
      />
      {errors.name && (
        <div className={styles.errorMsg}>{errors.name.message}</div>
      )}
      <Input
        type="file"
        placeholder="Update Profile..."
        {...register("image")}
      />
      {errors.image && (
        <div className={styles.errorMsg}>{errors.image.message}</div>
      )}
      <Button theme="authPrimary" type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Update Profile"}
      </Button>
    </form>
  );
};

export default UpdateProfile;
