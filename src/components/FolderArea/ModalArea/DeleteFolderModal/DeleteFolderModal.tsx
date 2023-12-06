import React from "react";
import { FolderModel } from "../../../../models/FolderModel";

type DeleteFolderModalProps = {
  folder: FolderModel;
  closeModal(): void;
};

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = (
  {
    // closeModal,
    // folder,
  }
) => {
  return <div>{/* Component content */}</div>;
};

export default DeleteFolderModal;
