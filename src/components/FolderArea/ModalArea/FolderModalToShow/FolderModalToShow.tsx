import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../utils/redux/store";
import { setContextFolder } from "../../../../utils/redux/foldersRedux/foldersSlice";
import DeleteFolderModal from "../DeleteFolderModal/DeleteFolderModal";
import RenameFolderModal from "../RenameFolderModal/RenameFolderModal";
import FolderDetailsModal from "../FolderDetailsModal/FolderDetailsModal";
const FolderModalToShow: React.FC = () => {
  const { contextFolder } = useSelector((state: RootState) => state.folders);
  const dispatch = useDispatch();
  if (!contextFolder) return null;
  const folder = contextFolder.folder;
  const closeModal = () => dispatch(setContextFolder(null));

  const Modal =
    contextFolder.option === "delete" ? (
      <DeleteFolderModal closeModal={closeModal} folder={folder} />
    ) : contextFolder.option === "details" ? (
      <FolderDetailsModal closeModal={closeModal} folder={folder} />
    ) : (
      <RenameFolderModal closeModal={closeModal} folder={folder} />
    );
  return Modal;
};

export default FolderModalToShow;
