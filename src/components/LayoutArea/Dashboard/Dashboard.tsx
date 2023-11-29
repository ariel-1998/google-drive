import React, { useState, useEffect } from "react";
import AddFolder from "../../FolderArea/AddFolder/AddFolder";
import AddFile from "../../FileArea/AddFile/AddFile";
import FolderChildren from "../../FolderArea/FolderChildren/FolderChildren";
import FolderPath from "../../FolderArea/FolderPath/FolderPath";
import { useParams } from "react-router-dom";
import styles from "./style.module.css";
import FilesUploadProgress from "../../FileArea/FilesUploadProgress/FilesUploadProgress";
import FileList from "../../FileArea/FileList/FileList";
import { ROOT_FOLDER } from "../../../utils/redux/foldersRedux/foldersSlice";
import { useFiles } from "../../../context/FilesProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";

const Dashboard: React.FC = () => {
  const { folderId: id } = useParams();
  const folderId = id || ROOT_FOLDER.id;

  return (
    <div>
      <div className={styles.formsAndPathWrapper}>
        <FolderPath folderId={folderId} />
        <div className={styles.forms}>
          <AddFile />
          <AddFolder />
        </div>
      </div>
      <div className={styles.content}>
        <FolderAndFileSlider folderId={folderId} />
      </div>
      <FilesUploadProgress />
    </div>
  );
};

export default Dashboard;

type FolderAndFileSliderProps = {
  folderId: string;
};
type Categories = "folders" | "files";

function FolderAndFileSlider({ folderId }: FolderAndFileSliderProps) {
  const { getCurrentFolderFiles } = useFiles();
  const { currentFolder } = useSelector((state: RootState) => state.folders);

  const [selectedCategory, setSelectedCategory] =
    useState<Categories>("folders");

  const selectFoldersCategory = () => setSelectedCategory("folders");
  const selectFilesCategory = () => setSelectedCategory("files");
  const foldersSelected = selectedCategory === "folders";

  useEffect(() => {
    if (foldersSelected) return;
    getCurrentFolderFiles();
  }, [currentFolder, selectedCategory]);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.categories}>
        <span
          className={`${foldersSelected && styles.selected}`}
          onClick={selectFoldersCategory}
        >
          Folders
        </span>
        <span
          className={`${!foldersSelected && styles.selected}`}
          onClick={selectFilesCategory}
        >
          Files
        </span>
      </div>

      <div className={styles.childrenWrapper}>
        <div
          className={`${styles.foldersCategory} ${
            foldersSelected && styles.selectedCategory
          }`}
        >
          <FolderChildren folderId={folderId} />
        </div>
        <div
          className={`${styles.filesCategory} ${
            !foldersSelected && styles.selectedCategory
          }`}
        >
          <FileList />
        </div>
      </div>
    </div>
  );
}
