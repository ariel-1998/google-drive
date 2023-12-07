import React, { useState } from "react";
import { FolderModel } from "../../../../models/FolderModel";
import Modal from "../../../Custom/Modal/Modal";
import styles from "./style.module.css";
import Button from "../../../Custom/Button/Button";
import Spinner from "../../../Custom/Spinner/Spinner";
type DeleteFolderModalProps = {
  folder: FolderModel;
  closeModal(): void;
};

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({
  closeModal,
  folder,
}) => {
  const triggerDeleteFolder = () => undefined;
  const [loading, setLoading] = useState();
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
        <Button disabled={loading} theme="danger" onClick={triggerDeleteFolder}>
          {loading ? <Spinner /> : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteFolderModal;
