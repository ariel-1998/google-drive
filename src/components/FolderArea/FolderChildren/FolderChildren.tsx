import React, { useEffect } from "react";
import { FolderModel } from "../../../models/FolderModel";
import Folder from "../Folder/Folder";
import { RootState } from "../../../utils/redux/store";
import { useSelector } from "react-redux";
import { foldersService } from "../../../services/foldersService";
import { ROOT_FOLDER } from "../../../utils/redux/filesRedux/foldersSlice";
import { useParams } from "react-router-dom";

type FolderChildrenProps = {
  folderId: string;
};

const FolderChildren: React.FC<FolderChildrenProps> = ({ folderId }) => {
  const { currentFolder } = useSelector((state: RootState) => state.folders);
  const { status, error } = useSelector(
    (state: RootState) => state.folders.actions.getFolderChildren
  );
  const fulfilled = status === "fulfilled";

  useEffect(() => {
    if (!folderId) {
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
    <div>
      {fulfilled &&
        currentFolder?.children?.map((child) => (
          //need to check if file then return file
          <Folder key={child.id} folder={child as FolderModel} />
        ))}
    </div>
  );
};

export default FolderChildren;
