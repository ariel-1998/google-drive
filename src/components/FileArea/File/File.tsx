import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { FileModel } from "../../../models/FileModel";
import { FaFile } from "react-icons/fa";
import ContextMenu from "../ContextMenu/ContextMenu";

type FileProps = {
  file: FileModel;
};

const File: React.FC<FileProps> = ({ file }) => {
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { top: 0, left: 0 },
  });

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      position: { top: e.clientY, left: e.clientX },
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ isVisible: false, position: { top: 0, left: 0 } });
  };

  return (
    <>
      {contextMenu.isVisible && (
        <ContextMenu
          file={file}
          closeMenu={handleCloseContextMenu}
          position={contextMenu.position}
        />
      )}
      <a
        onContextMenu={handleRightClick}
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
    </>
  );
};

export default File;
