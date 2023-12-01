import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../utils/redux/store";
import { useNavigate } from "react-router-dom";
import {
  ROOT_FOLDER,
  setPath,
} from "../../../utils/redux/foldersRedux/foldersSlice";
import styles from "./style.module.css";

type FolderPathProps = {
  folderId: string;
};

const FolderPath: React.FC<FolderPathProps> = ({ folderId }) => {
  const { path, currentFolder } = useSelector(
    (state: RootState) => state.folders
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigateAndSetNewPath = (index: number, pathId: string) => {
    const newPath = path.slice(0, index + 1);
    dispatch(setPath(newPath));
    navigate(pathId ? `/folder/${pathId}` : "/");
  };

  useEffect(() => {
    if (!!path.length) return;
    if (!folderId) {
      dispatch(setPath([{ id: ROOT_FOLDER.id, name: ROOT_FOLDER.name }]));
      return;
    }
    if (folderId && currentFolder) {
      const { id, name, path } = currentFolder;
      dispatch(setPath([...path, { id, name }]));
    }
  }, [currentFolder]);

  return (
    <div className={styles.breadCrumbsContainer}>
      {
        <>
          {path?.map((p, i) => {
            if (i !== path.length - 1) {
              return (
                <div key={p.id} className={styles.breadCrumbSpan}>
                  <span
                    className={styles.breadCrumb}
                    onClick={() => navigateAndSetNewPath(i, p.id)}
                  >
                    {p.name}
                  </span>
                  <span className={styles.divider}>/</span>
                </div>
              );
            }
            return (
              <span key={p.id}>
                {/** need to limit path amountand show only a part */}
                {p?.name}
              </span>
            );
          })}
        </>
      }
    </div>
  );
};

export default FolderPath;
