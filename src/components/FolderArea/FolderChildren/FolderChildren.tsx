import React, { useEffect } from "react";
import Folder from "../Folder/Folder";
import { RootState } from "../../../utils/redux/store";
import { useSelector } from "react-redux";
import { foldersService } from "../../../services/foldersService";
import { ROOT_FOLDER } from "../../../utils/redux/foldersRedux/foldersSlice";
import styles from "./style.module.css";
import Spinner from "../../Custom/Spinner/Spinner";
import useFirestoreError from "../../../hooks/useFirestoreError";

type FolderChildrenProps = {
  folderId: string;
};

const FolderChildren: React.FC<FolderChildrenProps> = ({ folderId }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { currentFolder } = useSelector((state: RootState) => state.folders);
  const { isLoading, isSuccessful, error } = useSelector(
    (state: RootState) => state.folders.actions.getFolderChildren
  );
  useFirestoreError(error);

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
      {isLoading && (
        <span className={styles.spinnerWrapper}>
          <Spinner />
        </span>
      )}
      {isSuccessful &&
        currentFolder?.children.map((child) => (
          <Folder key={child.id} folder={child} />
        ))}
    </div>
  );
};

export default FolderChildren;
