import React from "react";
import AddFolder from "../../FolderArea/AddFolder/AddFolder";
import AddFile from "../../FileArea/AddFile/AddFile";
import FolderChildren from "../../FolderArea/FolderChildren/FolderChildren";
import FolderPath from "../../FolderArea/FolderPath/FolderPath";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";
import FilesUploadProgress from "../../FileArea/FilesUploadProgress/FilesUploadProgress";
import FileList from "../../FileArea/FileList/FileList";
import { ROOT_FOLDER } from "../../../utils/redux/foldersRedux/foldersSlice";

const Dashboard: React.FC = () => {
  const { folderId: id } = useParams();
  const folderId = id || ROOT_FOLDER.id;

  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.formsAndPathWrapper}>
          <FolderPath folderId={folderId} />
          <div className={styles.forms}>
            <AddFile />
            <AddFolder />
          </div>
        </div>
        <FolderAndFileSlider folderId={folderId} />
      </div>
      <FilesUploadProgress />
    </>
  );
};

export default Dashboard;

type FolderAndFileSliderProps = {
  folderId: string;
};

function FolderAndFileSlider({ folderId }: FolderAndFileSliderProps) {
  return (
    <div className={styles.childrenWrapper}>
      <FolderChildren folderId={folderId} />
      <hr className={styles.divider} />
      <FileList />
    </div>
  );
}
