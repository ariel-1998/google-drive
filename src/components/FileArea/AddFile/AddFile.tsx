import React from "react";
import styles from "./style.module.css";
import { FaFileUpload } from "react-icons/fa";
const AddFile: React.FC = () => {
  return (
    <div className={styles.addFolder}>
      <FaFileUpload />
    </div>
  );
};

export default AddFile;
