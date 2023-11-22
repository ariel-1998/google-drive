import React, { useCallback, useEffect, useState } from "react";
import Folder from "../../FolderArea/Folder/Folder";
import AddFolder from "../../FolderArea/AddFolder/AddFolder";
import AddFile from "../../FileArea/AddFile/AddFile";
import { useParams } from "react-router-dom";
import { foldersService } from "../../../services/foldersService";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { FolderModel } from "../../../models/FolderModel";
import File from "../../FileArea/File/File";
import { FileModel } from "../../../models/FileModel";
import FolderChildren from "../../FolderArea/FolderChildren/FolderChildren";
import { ROOT_FOLDER } from "../../../utils/redux/filesRedux/foldersSlice";

const Dashboard: React.FC = () => {
  const { folderId } = useParams();

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <AddFolder />
      <br />
      <AddFile />

      <FolderChildren folderId={folderId || "null"} />
    </div>
  );
};

export default Dashboard;
