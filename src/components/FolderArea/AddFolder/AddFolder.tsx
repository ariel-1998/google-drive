import React, { useState } from "react";
import { FaFolderPlus } from "react-icons/fa";
import styles from "./style.module.css";
import { foldersService } from "../../../services/foldersService";
import { FolderModelWithoutId } from "../../../models/FolderModel";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import AddFolderForm from "../AddFolderForm/AddFolderForm";

const AddFolder: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const AddFolder = (folder: FolderModelWithoutId) => {
    foldersService.createFolder(folder);
  };
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <>
      <div className={styles.addFolder} onClick={openModal}>
        <FaFolderPlus />
      </div>
      {open && (
        <div className={styles.modal}>
          <AddFolderForm closeModal={closeModal} />
        </div>
      )}
    </>
  );
};

export default AddFolder;
