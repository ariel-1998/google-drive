import React, { useState } from "react";
import { FaFolderPlus } from "react-icons/fa";
import styles from "./style.module.css";
import AddFolderForm from "../AddFolderForm/AddFolderForm";

const AddFolder: React.FC = () => {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <>
      <div className={styles.addFolder} onClick={openModal}>
        <FaFolderPlus />
      </div>
      {open && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.innerModal}
          >
            <AddFolderForm closeModal={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddFolder;
