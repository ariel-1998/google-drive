import React from "react";
import AddFolder from "../../FolderArea/AddFolder/AddFolder";
import AddFile from "../../FileArea/AddFile/AddFile";
import { useParams } from "react-router-dom";
import FolderChildren from "../../FolderArea/FolderChildren/FolderChildren";

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
