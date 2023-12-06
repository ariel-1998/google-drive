import React, { useState } from "react";
import styles from "./style.module.css";
import { FaFolder } from "react-icons/fa";
import { FolderModel, Path } from "../../../models/FolderModel";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCurrentFolder,
  setPath,
} from "../../../utils/redux/foldersRedux/foldersSlice";
import FolderContextMenu from "../FolderContextMenu/FolderContextMenu";

type FolderProps = {
  folder: FolderModel;
};

const Folder: React.FC<FolderProps> = ({ folder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setFolder = () => {
    //passing new path state to new route to update path in redux automaticly with no delay
    const newPath: Path[] = [
      ...folder.path,
      { name: folder.name, id: folder.id },
    ];
    dispatch(setPath(newPath));
    dispatch(setCurrentFolder(folder));
    navigate(`/folder/${folder.id}`);
  };

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
        <FolderContextMenu
          folder={folder}
          closeMenu={handleCloseContextMenu}
          position={contextMenu.position}
        />
      )}
      <div
        title={folder.name}
        onClick={setFolder}
        onContextMenu={handleRightClick}
        className={styles.folder}
      >
        <i className={styles.icon}>
          <FaFolder />
        </i>
        {/** need to limit string length to and add dots instead */}
        <span className={styles.folderName}>{folder.name}</span>
      </div>
    </>
  );
};

export default Folder;
