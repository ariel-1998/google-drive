import React from "react";
import styles from "./style.module.css";
import { FaFolder } from "react-icons/fa";
import { FolderModel, Path } from "../../../models/FolderModel";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setCurrentFolder,
  setPath,
} from "../../../utils/redux/foldersRedux/foldersSlice";

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
    navigate(`/folder/${folder.id}`);
    dispatch(setPath(newPath));
    dispatch(setCurrentFolder(folder));
  };

  return (
    <div onClick={setFolder} className={styles.folder}>
      <i className={styles.icon}>
        <FaFolder />
      </i>
      {/** need to limit string length to and add dots instead */}
      <span>
        {folder.name} asdas dasd asdas a dsadasd asdiha sidu hasuisauisah
      </span>
    </div>
  );
};

export default Folder;
