import React, { useRef, useEffect, FormEvent } from "react";
import { FolderModel } from "../../../../models/FolderModel";
import { foldersService } from "../../../../services/foldersService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/redux/store";
import Modal from "../../../Custom/Modal/Modal";
import styles from "./style.module.css";
import Spinner from "../../../Custom/Spinner/Spinner";
import Input from "../../../Custom/Input/Input";
import Button from "../../../Custom/Button/Button";
import useResetActionState from "../../../../hooks/useResetActionState";
import useFirestoreError from "../../../../hooks/useFirestoreError";

type RenameFolderModalProps = {
  folder: FolderModel;
  closeModal(): void;
};

const RenameFolderModal: React.FC<RenameFolderModalProps> = ({
  closeModal,
  folder,
}) => {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { error, isLoading, isSuccessful } = useSelector(
    (state: RootState) => state.folders.actions.renameFolder
  );

  useFirestoreError(error);
  useResetActionState({ action: "folder", actionType: "renameFolder" });

  const submitRename = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = nameRef.current;
    if (!input) return;
    foldersService.renameFolder(folder, input.value);
  };

  useEffect(() => {
    if (!isSuccessful) return;
    closeModal();
  }, [isSuccessful]);

  return (
    <Modal closeModal={closeModal}>
      <form onSubmit={submitRename} className={styles.form}>
        <h3 className={styles.title}>Rename File</h3>
        <Input autoFocus defaultValue={folder.name} ref={nameRef} />
        <Button theme="authPrimary" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Rename"}
        </Button>
      </form>
    </Modal>
  );
};

export default RenameFolderModal;
