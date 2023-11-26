import React from "react";
import styles from "./style.module.css";
import { FileModel } from "../../../models/FileModel";
import { FaFile } from "react-icons/fa";

type FileProps = {
  file: FileModel;
};

const File: React.FC<FileProps> = ({ file }) => {
  return (
    <a
      href={file.url}
      target="_blank"
      title={file.name}
      className={styles.link}
    >
      <div className={styles.fileContainer}>
        <i className={styles.icon}>
          <FaFile />
        </i>
        <span className={styles.fileName}>{file.name}</span>
      </div>
    </a>
  );
};

export default File;
