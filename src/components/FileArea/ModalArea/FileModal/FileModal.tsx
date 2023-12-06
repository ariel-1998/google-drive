import React, { ReactNode, useEffect } from "react";
import styles from "./style.module.css";
import ReactDOM from "react-dom";
type FileModalProps = {
  closeModal: () => void;
  children: ReactNode;
  className?: string;
};

const FileModal: React.FC<FileModalProps> = ({
  children,
  closeModal,
  className,
}) => {
  return ReactDOM.createPortal(
    <div className={styles.modal} onClick={closeModal}>
      <div
        className={`${styles.innerModal} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default FileModal;
