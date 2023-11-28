import React from "react";
import { useFiles } from "../../../context/FilesProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import File from "../File/File";
import styles from "./style.module.css";

const FileList: React.FC = () => {
  const { files, fetchingFiles } = useFiles();
  const { currentFolder } = useSelector((state: RootState) => state.folders);

  const filesInCurrentFolder =
    (currentFolder?.id && files[currentFolder?.id]) || [];

  return (
    <div className={styles.filesContainer}>
      {fetchingFiles && "loading..."}
      {filesInCurrentFolder.map((file) => (
        <File key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FileList;
