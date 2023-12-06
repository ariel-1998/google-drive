import React from "react";
import { useFiles } from "../../../../context/FilesProvider";
import DeleteFileModal from "../DeleteFileModal/DeleteFileModal";
import FileDetailsModal from "../FileDetailsModal/FileDetailsModal";
import RenameFileModal from "../RenameFileModal/RenameFileModal";

const ModalToShow: React.FC = () => {
  const { fileDisplayed, setDisplayedFile } = useFiles();
  if (!fileDisplayed) return null;
  const file = fileDisplayed.file;
  const closeModal = () => setDisplayedFile(null);

  const Modal =
    fileDisplayed.option === "delete" ? (
      <DeleteFileModal closeModal={closeModal} file={file} />
    ) : fileDisplayed.option === "details" ? (
      <FileDetailsModal closeModal={closeModal} file={file} />
    ) : (
      <RenameFileModal closeModal={closeModal} file={file} />
    );
  return Modal;
};

export default ModalToShow;
