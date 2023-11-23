import React from "react";
import styles from "./style.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { Link } from "react-router-dom";

const FolderPath: React.FC = () => {
  const { currentFolder } = useSelector((state: RootState) => state.folders);

  const path = currentFolder?.path;

  return (
    <div>
      {
        <>
          {path?.map((p) => (
            <Link key={p.id} to={p.id ? `/folder/${p.id}` : "/"}>
              {p.name}/
            </Link>
          ))}
        </>
      }
      <span>{currentFolder?.name}</span>
    </div>
  );
};

export default FolderPath;
