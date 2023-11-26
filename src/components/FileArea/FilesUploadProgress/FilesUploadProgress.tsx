import React from "react";
import { useFiles } from "../../../context/FilesProvider";
import ReactDOM from "react-dom";

const FilesUploadProgress: React.FC = () => {
  const { filesState } = useFiles();
  return (
    <div>
      {!!filesState.length &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: 2,
              right: 2,
              backgroundColor: "green",
            }}
          >
            {filesState.map((file) => (
              <div key={file.fileId}>
                <span>{file.fileName}</span>
                <span>{file.status}</span>
                <span>{file.uploadProgress}</span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default FilesUploadProgress;
