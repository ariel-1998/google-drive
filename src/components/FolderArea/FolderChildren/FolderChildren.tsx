import React, { useEffect } from "react";
import { FolderModel } from "../../../models/FolderModel";
import Folder from "../Folder/Folder";
import { RootState } from "../../../utils/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { foldersService } from "../../../services/foldersService";
import { ROOT_FOLDER } from "../../../utils/redux/filesRedux/foldersSlice";
import { useNavigate } from "react-router-dom";

type FolderChildrenProps = {
  folderId: string;
};

const FolderChildren: React.FC<FolderChildrenProps> = ({ folderId }) => {
  const navigate = useNavigate();
  const {
    currentFolder,
    actions: {
      getFolderChildren: { error, status },
    },
  } = useSelector((state: RootState) => state.folders);

  const fulfilled = status === "fulfilled";
  useEffect(() => {
    if (!currentFolder && folderId) navigate("/");
    foldersService.getFolderChildren(ROOT_FOLDER);
  }, []);

  return (
    <div>
      {fulfilled &&
        currentFolder?.children.map((child) => (
          //need to check if file then return file
          <Folder key={child.id} folder={child as FolderModel} />
        ))}
    </div>
  );
};

export default FolderChildren;
