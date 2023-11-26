import React, { ChangeEvent } from "react";
import styles from "./style.module.css";
import { FaFileUpload } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../utils/firebaseConfig";
import { useFiles } from "../../../context/FilesProvider";

const AddFile: React.FC = () => {
  const { handleUploadFiles } = useFiles();
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleUploadFiles(file);
  };

  return (
    <label className={styles.addFolder} htmlFor="upload-file">
      <FaFileUpload />
      <input
        type="file"
        onChange={handleFile}
        id="upload-file"
        className={styles.input}
      />
    </label>
  );
};

export default AddFile;
