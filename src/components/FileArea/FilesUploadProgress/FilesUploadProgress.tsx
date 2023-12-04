import React, { useState, DragEvent, useRef } from "react";
import { FileState, useFiles } from "../../../context/FilesProvider";
import styles from "./style.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";

const FilesUploadProgress: React.FC = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { filesState } = useFiles();
  const [show, setShow] = useState(false);
  const onMouseDown = () => {};
  const onMouseUp = () => {};
  const onMouseMove = () => {};

  return (
    <div
      ref={listRef}
      className={`${styles.shirnkWindow} ${show && styles.open}`}
    >
      <div className={styles.dragAndShowDiv}>
        <span
          className={styles.openListBtn}
          onClick={() => setShow((pre) => !pre)}
        >
          {!show ? "Show" : "Hide"} Upload
        </span>
        <span className={styles.dragBtn}>Drag</span>
      </div>
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
  function pauseAndRunTask() {
    if (!file.uploadTask) return;
    file.status === "Paused"
      ? file.uploadTask.resume()
      : file.uploadTask.pause();
  }

  const cancelTask = () => {
    file.uploadTask && file.uploadTask.cancel();
  };

  return (
    <div className={styles.fileWrapper} onDoubleClick={cancelTask}>
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
              {file.status === "Canceled"
                ? "Upload was Canceled"
                : file.errorMsg
                ? file.errorMsg
                : "Could not upload file."}
            </span>
          </div>
        )}
      </div>
      {file.error ? (
        <i
          className={styles.deleteIcon}
          onClick={() => removeFileOnError(file.fileId)}
        >
          Remove <AiOutlineClose />
        </i>
      ) : (
        <i className={styles.playIconsWrapper}>
          {file.status === "Running" ? (
            <>
              Pause:{" "}
              <FaCirclePlay
                onClick={pauseAndRunTask}
                className={styles.playIcon}
              />
            </>
          ) : (
            <>
              Play:{" "}
              <FaCirclePause
                onClick={pauseAndRunTask}
                className={styles.playIcon}
              />
            </>
          )}
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
