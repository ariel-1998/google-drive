import React, { useEffect } from "react";
import Folder from "../Folder/Folder";
import { RootState } from "../../../utils/redux/store";
import { useSelector } from "react-redux";
import { foldersService } from "../../../services/foldersService";
import { ROOT_FOLDER } from "../../../utils/redux/foldersRedux/foldersSlice";
import styles from "./style.module.css";

type FolderChildrenProps = {
  folderId: string;
};

const FolderChildren: React.FC<FolderChildrenProps> = ({ folderId }) => {
  const { currentFolder } = useSelector((state: RootState) => state.folders);
  const { status, error } = useSelector(
    (state: RootState) => state.folders.actions.getFolderChildren
  );
  const { user } = useSelector((state: RootState) => state.user);
  const fulfilled = status === "fulfilled";

  useEffect(() => {
    if (folderId === user?.uid) {
      console.log(ROOT_FOLDER);
      foldersService.getFolderChildren(ROOT_FOLDER);
      return;
    }
    if (currentFolder && folderId === currentFolder.id) {
      foldersService.getFolderChildren(currentFolder);
      return;
    }
    foldersService.getFolder(folderId);
  }, [folderId]);

  return (
    <div className={styles.foldersContainer}>
      {fulfilled &&
        currentFolder?.children.map((child) => (
          //need to check if file then return file
          <Folder key={child.id} folder={child} />
        ))}
    </div>
  );
};

export default FolderChildren;
