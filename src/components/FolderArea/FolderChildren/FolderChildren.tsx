import React, { useEffect } from "react";
import { FolderModel } from "../../../models/FolderModel";
import Folder from "../Folder/Folder";
import { RootState } from "../../../utils/redux/store";
import { useSelector } from "react-redux";
import { foldersService } from "../../../services/foldersService";
import { ROOT_FOLDER } from "../../../utils/redux/filesRedux/foldersSlice";
import { useNavigate } from "react-router-dom";
import FolderPath from "../FolderPath/FolderPath";

type FolderChildrenProps = {
  folderId: string;
};

const FolderChildren: React.FC<FolderChildrenProps> = ({ folderId }) => {
  const {
    currentFolder,
    actions: {
      getFolderChildren: { error, status },
    },
  } = useSelector((state: RootState) => state.folders);

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
      <FolderPath />

      {fulfilled &&
        currentFolder?.children?.map((child) => (
          //need to check if file then return file
          <Folder key={child.id} folder={child as FolderModel} />
        ))}
    </div>
  );
};

export default FolderChildren;
