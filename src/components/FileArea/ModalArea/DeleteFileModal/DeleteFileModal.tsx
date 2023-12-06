import React, { useState } from "react";
import { FileModel } from "../../../../models/FileModel";
import Modal from "../../../Custom/Modal/Modal";
import styles from "./style.module.css";
import Button from "../../../Custom/Button/Button";
import { useFiles } from "../../../../context/FilesProvider";
import Spinner from "../../../Custom/Spinner/Spinner";
type DeleteFileModalProps = {
  file: FileModel;
  closeModal(): void;
};

const DeleteFileModal: React.FC<DeleteFileModalProps> = ({
  closeModal,
  file,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const { deleteFile } = useFiles();
  const triggerDeleteFile = async () => {
    try {
      setError(null);
      setLoading(true);
      await deleteFile(file);
      closeModal();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal closeModal={closeModal} className={styles.modal}>
      <h3 className={styles.title}>Delete File</h3>
      <span className={styles.danger}>
        <span>Note: </span>File will be lost forever!
      </span>
      <span className={styles.warning}>
        Are you sure you want to delete this file?
      </span>
      <div className={styles.btnWrapper}>
        <Button theme="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button disabled={loading} theme="danger" onClick={triggerDeleteFile}>
          {loading ? <Spinner /> : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteFileModal;
