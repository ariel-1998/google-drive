import React from "react";
import styles from "./style.module.css";
import { FileModel } from "../../../models/FileModel";

type FileProps = {
  file: FileModel;
};

const File: React.FC<FileProps> = ({ file }) => {
  return <div>file:</div>;
};

export default File;
