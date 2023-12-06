import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import ReactDOM from "react-dom";
import { FileDisplasOptions } from "../../../context/FilesProvider";
import { FolderModel } from "../../../models/FolderModel";

type FolderContextMenuProps = {
  position: { top: number; left: number };
  closeMenu: () => void;
  folder: FolderModel;
};

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  position,
  closeMenu,
  folder,
}) => {
  const [adjustPosition, setAdjustPosition] =
    useState<typeof position>(position);

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const listRect = listRef.current.getBoundingClientRect();

    const minHeight = Math.min(
      position.top,
      window.innerHeight - listRect.height
    );
    const minWidth = Math.min(
      position.left,
      window.innerWidth - listRect.width
    );
    //this check will prevent double render if not adjustment is not needed needed
    setAdjustPosition((prev) => {
      return minHeight !== position.top || minWidth !== position.left
        ? {
            top: Math.min(position.top, window.innerHeight - listRect.height),
            left: Math.min(position.left, window.innerWidth - listRect.width),
          }
        : prev;
    });
    listRef.current.focus();
  }, []);

  const onOptionClick = (option: FileDisplasOptions) => {
    closeMenu();
  };

  return (
    <>
      {ReactDOM.createPortal(
        <ul
          className={styles.list}
          ref={listRef}
          tabIndex={0}
          onBlur={closeMenu}
          onClick={(e) => e.stopPropagation()}
          style={{
            top: adjustPosition.top,
            left: adjustPosition.left,
          }}
        >
          <li onClick={() => onOptionClick("rename")}>Rename Folder</li>
          <li onClick={() => onOptionClick("delete")}>Delete Folder</li>
          <li onClick={() => onOptionClick("details")}>Folder Details</li>
        </ul>,
        document.body
      )}
    </>
  );
};

export default FolderContextMenu;
