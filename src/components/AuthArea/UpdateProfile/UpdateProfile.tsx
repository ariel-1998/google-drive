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

const UpdateProfile: React.FC = () => {
  const { status, error } = useSelector(
    (state: RootState) => state.user.actions.updateProfileNameAsync
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [storageError, setStorageError] = useState("");
  const loading = status === "pending";
  const fulfilled = status === "fulfilled";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
  });

  const submitUpdateName = (data: UserProfileForm) => {
    if (!user?.uid) return;
    setStorageError("");
    userService.updateName(data.name);
    //might need to optimize image before uploading
    if (!data.image?.[0]) return;
    uploadImageFile(user.uid, data.image[0])
      .then((url) => {
        userService.updateProfileImage(url as string);
      })
      .catch((e) => setStorageError(e.message));
  };

  const uploadImageFile = async (userId: string, file: File) => {
    const storageRef = ref(storage, userId);
    const data = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(data.ref);
    return url;
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submitUpdateName)}>
      <h2 className={styles.heading}>Update Profile</h2>
      {!!error ||
        (storageError && (
          <div className={styles.errorHeading}>{error || storageError}</div>
        ))}
      {fulfilled && <div className={styles.successHeading}>Check Mail Box</div>}
      <Input
        type="text"
        placeholder="Update Name..."
        defaultValue={user?.displayName || ""}
        {...register("name")}
      />
      {errors.name && (
        <div className={styles.errorMsg}>{errors.name.message}</div>
      )}
      {/** need to add possibility to delete profile image */}
      {/** i will add a checkbox to remove profile image*/}
      <Input
        type="file"
        placeholder="Update Profile..."
        {...register("image")}
      />
      {errors.image && (
        <div className={styles.errorMsg}>{errors.image.message}</div>
      )}
      <Button theme="secondary" type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Update Profile"}
      </Button>
    </form>
  );
};

export default UpdateProfile;
