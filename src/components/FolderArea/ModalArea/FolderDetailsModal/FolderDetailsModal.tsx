import React from "react";
import { FolderModel } from "../../../../models/FolderModel";
import Modal from "../../../Custom/Modal/Modal";
import styles from "./style.module.css";
import { Timestamp } from "firebase/firestore";
import { formatDate } from "../../../../utils/dateFormatter";

type FolderDetailsModalProps = {
  folder: FolderModel;
  closeModal(): void;
};

const FolderDetailsModal: React.FC<FolderDetailsModalProps> = ({
  folder,
  closeModal,
}) => {
  const createdAt = formatDate(folder.createdAt as Timestamp | Date);

  return (
    <Modal closeModal={closeModal} className={styles.modal}>
      <h3 className={styles.title}>Details</h3>
      <div className={styles.details}>
        <span className={styles.detailTitle}>Folder Name: </span>
        <span>{folder.name}</span>
        <span className={styles.detailTitle}>Created At:</span>
        <span> {createdAt}</span>
      </div>
    </Modal>
  );
};

export default FolderDetailsModal;
