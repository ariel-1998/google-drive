import React from "react";
import styles from "./style.module.css";
import { FaFolder } from "react-icons/fa";
import { FolderModel } from "../../../models/FolderModel";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentFolder } from "../../../utils/redux/filesRedux/foldersSlice";

type FolderProps = {
  folder: FolderModel;
};

const Folder: React.FC<FolderProps> = ({ folder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setFolder = () => {
    navigate(`/folder/${folder.id}`);
    dispatch(setCurrentFolder(folder));
  };
  return (
    <div onClick={setFolder} className={styles.folder}>
      <FaFolder />
      {folder?.id}
    </div>
  );
};

export default Folder;
