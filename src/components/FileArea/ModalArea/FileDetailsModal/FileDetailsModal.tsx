import React from "react";
import { formatDate } from "../../../../utils/dateFormatter";
import { Timestamp } from "firebase/firestore";
import Modal from "../../../Custom/Modal/Modal";
import styles from "./style.module.css";
import { FileModel } from "../../../../models/FileModel";

type FileDetailsModalProps = {
  file: FileModel;
  closeModal: () => void;
};

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  file,
  closeModal,
}) => {
  const uploadedAt = formatDate(file.uploadedAt as Timestamp | Date);

  return (
    <Modal closeModal={closeModal} className={styles.modal}>
      <h3 className={styles.title}>Details</h3>
      <div className={styles.details}>
        <span className={styles.detailTitle}>File Name: </span>
        <span>{file.name}</span>
        <span className={styles.detailTitle}>Uploaded At:</span>
        <span> {uploadedAt}</span>
      </div>
    </Modal>
  );
};

export default FileDetailsModal;
