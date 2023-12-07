import React, { useEffect, useState } from "react";
import { FolderModel } from "../../../../models/FolderModel";
import Modal from "../../../Custom/Modal/Modal";
import styles from "./style.module.css";
import Button from "../../../Custom/Button/Button";
import Spinner from "../../../Custom/Spinner/Spinner";
import { foldersService } from "../../../../services/foldersService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../utils/redux/store";
import useFirestoreError from "../../../../hooks/useFirestoreError";
import useResetActionState from "../../../../hooks/useResetActionState";
type DeleteFolderModalProps = {
  folder: FolderModel;
  closeModal(): void;
};

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  closeModal,
  folder,
}) => {
  const { error, isLoading, isSuccessful } = useSelector(
    (state: RootState) => state.folders.actions.deleteFolder
  );
  useFirestoreError(error);
  useResetActionState({ action: "folder", actionType: "deleteFolder" });

  useEffect(() => {
    if (!isSuccessful) return;
    closeModal();
  }, [isSuccessful]);

  const triggerDeleteFolder = () => {
    foldersService.deleteFolder(folder);
  };

  return (
    <Modal closeModal={closeModal} className={styles.modal}>
      <h3 className={styles.title}>Delete Folder</h3>
      <span className={styles.warning}>
        Are you sure you want to delete this Folder?
      </span>
      <span className={styles.danger}>
        Deleting Folder will also DELETE all files and folders in it!
      </span>
      <div className={styles.btnWrapper}>
        <Button theme="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          theme="danger"
          onClick={triggerDeleteFolder}
        >
          {isLoading ? <Spinner /> : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteFolderModal;
