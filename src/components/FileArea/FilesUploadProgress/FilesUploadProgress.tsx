import React, { useState } from "react";
import { FileState, useFiles } from "../../../context/FilesProvider";
import styles from "./style.module.css";
import { AiOutlineClose } from "react-icons/ai";

const FilesUploadProgress: React.FC = () => {
  const { filesState } = useFiles();
  const [show, setShow] = useState(false);

  return (
    <div className={`${styles.shirnkWindow} ${show && styles.open}`}>
      <span onClick={() => setShow((pre) => !pre)}>
        {!show ? "Show" : "Hide"} Upload
      </span>
      <div className={`${styles.transitionDiv} ${show && styles.show}`}>
        {!!filesState.length
          ? filesState.map((file) => (
              <FileUpload file={file} key={file.fileId} />
            ))
          : "No Uploads"}
      </div>
    </div>
  );
};

export default FilesUploadProgress;

type FileUploadProps = {
  file: FileState;
};

function FileUpload({ file }: FileUploadProps) {
  const { removeFileOnError } = useFiles();
  return (
    <div className={styles.fileWrapper}>
      <div className={styles.detailsDiv}>
        <div>
          <span className={styles.fileDetailSpan}>Name:</span>
          <span>{file.fileName}</span>
        </div>
        <div>
          <span className={styles.fileDetailSpan}>Status:</span>
          <span>{file.status}</span>
        </div>
        {file.error && (
          <div>
            <span className={`${styles.fileDetailSpan} ${styles.error}`}>
              error:
            </span>
            <span>
              {file.errorMsg ? file.errorMsg : "Could not upload file."}
            </span>
          </div>
        )}
      </div>
      {file.error && (
        <i
          className={styles.deleteIcon}
          onClick={() => removeFileOnError(file.fileId)}
        >
          Remove <AiOutlineClose />
        </i>
      )}
      <div className={styles.progressBarWrapper}>
        <div
          className={styles.percetage}
          style={{
            color: file.uploadProgress > 50 ? "white" : "black",
          }}
        >
          {file.uploadProgress.toFixed()}%
        </div>
        <div
          style={{
            backgroundColor: file.error ? "red" : "var(--progress-bar-color)",
            width: file.error ? "100%" : `${file.uploadProgress.toFixed()}%`,
          }}
          className={styles.progressBar}
        />
      </div>
    </div>
  );
}
