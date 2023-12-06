import React, { FormEvent, useRef, useState } from "react";
import { useFiles } from "../../../../context/FilesProvider";
import FileModal from "../FileModal/FileModal";
import styles from "./style.module.css";
import Input from "../../../Custom/Input/Input";
import { FileModel } from "../../../../models/FileModel";
import Button from "../../../Custom/Button/Button";
import useFirestoreError from "../../../../hooks/useFirestoreError";
import { SerializedError } from "@reduxjs/toolkit";

type RenameFileModalProps = {
  file: FileModel;
  closeModal: () => void;
};

const RenameFileModal: React.FC<RenameFileModalProps> = ({
  closeModal,
  file,
}) => {
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const { renameFile } = useFiles();
  const [error, setError] = useState<SerializedError | null>(null);
  useFirestoreError(error);
  async function submitRename(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = nameRef.current;
    if (!input) return;
    if (!file.id) return;
    setLoading(true);
    setError(null);
    try {
      await renameFile(file.id, input.value);
      closeModal();
    } catch (error) {
      setError(error as SerializedError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FileModal closeModal={closeModal}>
      <form onSubmit={submitRename} className={styles.form}>
        <h3 className={styles.title}>Rename File</h3>
        <Input autoFocus defaultValue={file.name} ref={nameRef} />
        <Button theme="authPrimary" disabled={loading}>
          Rename
        </Button>
      </form>
    </FileModal>
  );
};

export default RenameFileModal;
