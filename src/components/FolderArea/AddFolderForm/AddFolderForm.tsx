import React, { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import Button from "../../Custom/Button/Button";
import Spinner from "../../Custom/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { foldersService } from "../../../services/foldersService";
import {
  FolderModel,
  FolderModelWithoutId,
  Path,
} from "../../../models/FolderModel";
import Input from "../../Custom/Input/Input";
import useFirestoreError from "../../../hooks/useFirestoreError";
import { toastService } from "../../../services/toastService";
import useResetActionState from "../../../hooks/useResetActionState";
import { resetFolderActionState } from "../../../utils/redux/foldersRedux/foldersSlice";

type AddFolderFormProps = {
  closeModal(): void;
};

const AddFolderForm: React.FC<AddFolderFormProps> = ({ closeModal }) => {
  const { currentFolder } = useSelector((state: RootState) => state.folders);
  const { user } = useSelector((state: RootState) => state.user);
  const { error, isLoading, isSuccessful } = useSelector(
    (state: RootState) => state.folders.actions.addFolder
  );
  const dispatch = useDispatch();
  useFirestoreError(error);
  const folderNameRef = useRef<HTMLInputElement | null>(null);

  const submitCreateFolder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!folderNameRef.current || !user?.uid || !currentFolder) return;
    const folderName = folderNameRef.current.value;
    if (!folderName.trim()) {
      return toastService.error("Folder Name is Required.");
    }
    const newFolder = createFolder(currentFolder, folderName, user.uid);
    foldersService.createFolder(newFolder);
  };

  function createFolder(
    currentFolder: FolderModel,
    folderName: string,
    userId: string
  ) {
    const pathToAdd: Path = { name: currentFolder.name, id: currentFolder.id };

    const newPath = currentFolder?.path
      ? [...currentFolder.path, pathToAdd]
      : [pathToAdd];

    const newFolder: FolderModelWithoutId = {
      children: [],
      name: folderName,
      parentId: currentFolder.id,
      userId: userId,
      path: newPath,
    };
    return newFolder;
  }
  useEffect(() => {
    if (!isSuccessful) return;
    console.log("what");
    closeModal();
    dispatch(resetFolderActionState("addFolder"));
  }, [isSuccessful]);

  useEffect(() => {
    if (!folderNameRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        (entries[0].target as HTMLInputElement).focus();
      } else {
        if (folderNameRef.current) folderNameRef.current.value = "";
      }
    });

    observer.observe(folderNameRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <form className={styles.form} onSubmit={submitCreateFolder}>
      <h2 className={styles.heading}>Create Folder</h2>
      <Input type="text" placeholder="Folder Name..." ref={folderNameRef} />
      <Button theme="primary" type="submit" disabled={isLoading}>
        {isLoading ? <Spinner /> : "Create"}
      </Button>
    </form>
  );
};

export default AddFolderForm;
