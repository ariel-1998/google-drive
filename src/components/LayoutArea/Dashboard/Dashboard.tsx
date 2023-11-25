import React from "react";
import AddFolder from "../../FolderArea/AddFolder/AddFolder";
import AddFile from "../../FileArea/AddFile/AddFile";
import FolderChildren from "../../FolderArea/FolderChildren/FolderChildren";
import FolderPath from "../../FolderArea/FolderPath/FolderPath";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";

const Dashboard: React.FC = () => {
  const { folderId: id } = useParams();
  const folderId = id || "";

  return (
    <div className={styles.dashboard}>
      <div className={styles.formsAndPathWrapper}>
        <div className={styles.forms}>
          <AddFolder />
          <AddFile />
        </div>
        <FolderPath folderId={folderId} />
      </div>
      <FolderChildren folderId={folderId} />
    </div>
  );
};

export default Dashboard;
