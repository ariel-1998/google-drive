import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import Button from "../../Custom/Button/Button";
import Spinner from "../../Custom/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { foldersService } from "../../../services/foldersService";
import { FolderModelWithoutId } from "../../../models/FolderModel";
import Input from "../../Custom/Input/Input";
import { useParams } from "react-router-dom";
import { resetAddFolderStatus } from "../../../utils/redux/filesRedux/foldersSlice";

type AddFolderFormProps = {
  closeModal(): void;
};

const AddFolderForm: React.FC<AddFolderFormProps> = ({ closeModal }) => {
  const { error: serverError, status } = useSelector(
    (state: RootState) => state.folders.actions.addFolder
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { folderId: parentId } = useParams();
  const folderNameRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const submitCreateFolder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!folderNameRef.current || !user?.uid) return;
    const folderName = folderNameRef.current.value;
    if (!folderName.trim()) return setError("Folder Name is Required.");
    setError("");
    const newFolder: FolderModelWithoutId = {
      children: [],
      name: folderName,
      parentId: parentId || "null",
      userId: user.uid,
    };
    foldersService.createFolder(newFolder);
  };

  const fulfilled = status === "fulfilled";
  const loading = status === "pending";

  useEffect(() => {
    console.log(status);
    if (fulfilled) closeModal();
    return () => {
      dispatch(resetAddFolderStatus());
    };
  }, [fulfilled]);

  return (
    <form className={styles.form} onSubmit={submitCreateFolder}>
      <h2 className={styles.heading}>Create Folder</h2>

      {(error || serverError) && (
        <div className={styles.errorHeading}>
          {error} {serverError}
        </div>
      )}
      <Input type="text" placeholder="Folder Name..." ref={folderNameRef} />

      <Button theme="primary" type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Create"}
      </Button>
    </form>
  );
};

export default AddFolderForm;
