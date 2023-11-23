import React from "react";
import AddFolder from "../../FolderArea/AddFolder/AddFolder";
import AddFile from "../../FileArea/AddFile/AddFile";
import { useParams } from "react-router-dom";
import FolderChildren from "../../FolderArea/FolderChildren/FolderChildren";
import FolderPath from "../../FolderArea/FolderPath/FolderPath";

const Dashboard: React.FC = () => {
  const { folderId } = useParams();

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <AddFolder />
      <br />
      <AddFile />
      <br />
      <br />
      <FolderChildren folderId={folderId || ""} />
    </div>
  );
};

export default Dashboard;
