import React from "react";
import AddFolder from "../../FolderArea/AddFolder/AddFolder";
import AddFile from "../../FileArea/AddFile/AddFile";
import FolderChildren from "../../FolderArea/FolderChildren/FolderChildren";
import FolderPath from "../../FolderArea/FolderPath/FolderPath";
import { useParams } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { folderId: id } = useParams();
  const folderId = id || "";
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <AddFolder />
      <br />
      <AddFile />
      <br />
      <FolderPath folderId={folderId} />
      <br />
      <FolderChildren folderId={folderId} />
    </div>
  );
};

export default Dashboard;
