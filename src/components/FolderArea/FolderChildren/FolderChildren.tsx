import React, { useEffect } from "react";
import Folder from "../Folder/Folder";
import { RootState } from "../../../utils/redux/store";
import { useSelector } from "react-redux";
import { foldersService } from "../../../services/foldersService";
import { ROOT_FOLDER } from "../../../utils/redux/foldersRedux/foldersSlice";
import styles from "./style.module.css";
import Spinner from "../../Custom/Spinner/Spinner";

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
  const loading = status === "pending";

  useEffect(() => {
    if (folderId === user?.uid) {
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
      {loading && (
        <span className={styles.spinnerWrapper}>
          <Spinner />
        </span>
      )}
      {fulfilled &&
        currentFolder?.children.map((child) => (
          <Folder key={child.id} folder={child} />
        ))}
    </div>
  );
};

export default FolderChildren;
