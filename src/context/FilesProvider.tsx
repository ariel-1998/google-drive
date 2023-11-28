import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../utils/redux/store";
import {
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { dbCollectionRefs, storage } from "../utils/firebaseConfig";
import { v4 as uuidV4 } from "uuid";
import {
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { FileModel } from "../models/FileModel";
import { Outlet } from "react-router-dom";
import { resetAuthStateOnLogout } from "../utils/redux/userRedux/userSlice";
import { resetFolderStateOnLogout } from "../utils/redux/foldersRedux/foldersSlice";

type FilesContextProps = {
  filesState: FileState[];
  files: FilesCache;
  fetchingFiles: boolean;
  handleUploadFiles: (file: File) => void;
  getCurrentFolderFiles(): Promise<void>;
  removeFileOnError(fileId: string): void;
};

const FilesContext = createContext<FilesContextProps | null>(null);

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) throw new Error("useFiles must be used inside FilesProvider.");
  return context;
};

export type FileState = {
  fileId: string;
  fileName: string;
  uploadProgress: number;
  status: "running" | "paused" | "canceled";
  error: boolean;
  errorMsg: string | null;
};

type FilesCache = Record<string, FileModel[]>;

const FilesProvider: React.FC = () => {
  const { path, currentFolder } = useSelector(
    (state: RootState) => state.folders
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [filesState, setFilesState] = useState<FileState[]>([]);
  const [files, setFiles] = useState<FilesCache>({});
  const [fetchingFiles, setFetchingFiles] = useState(false);

  const dispatch = useDispatch();

  const handleUploadFiles = async (file: File) => {
    if (!path || !user?.uid) return;
    const filePath = `${path.map((p) => p.id).join("/")}/${file.name}`;
    //add metadata {userId: user.uid} to storageRef
    const storageRef = ref(storage, filePath);
    const tempFileId = uuidV4();

    const newFileState: FileState = {
      fileName: file.name,
      error: false,
      status: "running",
      uploadProgress: 0,
      fileId: tempFileId,
      errorMsg: null,
    };

    //check for file duplicates
    const fileDuplicate = await checkForFileDuplicate(storageRef, tempFileId);
    if (fileDuplicate) return;

    setFilesState((prevState) => [...prevState, newFileState]);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      customMetadata: { userId: user.uid },
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => uploadTaskOnStateChange(snapshot, tempFileId),
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        uploadTaskOnError(tempFileId, error.message);
      },
      () => {
        // Handle successful uploads on complete
        uploadTaskOnSuccess(uploadTask, file, tempFileId);
      }
    );
  };

  function uploadTaskOnStateChange(
    snapshot: UploadTaskSnapshot,
    tempFileId: string
  ) {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setFilesState((prevState) =>
      prevState.map((file) => {
        if (file.fileId === tempFileId) {
          return { ...file, uploadProgress: progress };
        }
        return file;
      })
    );
    switch (snapshot.state) {
      case "paused":
        setFilesState((prevState) =>
          prevState.map((file) => {
            if (file.fileId === tempFileId) {
              return { ...file, status: "paused" };
            }
            return file;
          })
        );
        break;
      case "running":
        setFilesState((prevState) =>
          prevState.map((file) => {
            if (file.fileId === tempFileId) {
              return { ...file, status: "running" };
            }
            return file;
          })
        );
        break;
    }
  }

  async function uploadTaskOnSuccess(
    uploadTask: UploadTask,
    file: File,
    tempFileId: string
  ) {
    try {
      const donloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      const fileObj: FileModel = {
        name: file.name,
        parentId: path[path.length - 1].id,
        userId: user?.uid,
        url: donloadUrl,
        uploadedAt: serverTimestamp(),
      };
      const uploadedFile = await addDoc(dbCollectionRefs.files, fileObj);

      const fileWithId: FileModel = {
        ...fileObj,
        id: uploadedFile.id,
        uploadedAt: new Date(),
      };
      setFiles((prevFiles) => {
        const currentFolderId = path[path.length - 1].id;
        console.log("files", files);
        if (prevFiles[currentFolderId]) {
          return {
            ...prevFiles,
            [currentFolderId]: [...prevFiles[currentFolderId], fileWithId],
          };
        }
        return { ...prevFiles, [currentFolderId]: [fileWithId] };
      });
      setFilesState((prevState) => {
        return prevState.filter((file) => file.fileId !== tempFileId);
      });
    } catch (error: any) {
      uploadTaskOnError(tempFileId, error.message);
    }
  }

  function uploadTaskOnError(tempFileId: string, errMsg: string) {
    setFilesState((prevState) =>
      prevState.map((file) => {
        if (file.fileId === tempFileId) {
          return { ...file, error: true, errorMsg: errMsg };
        }
        return file;
      })
    );
  }

  async function checkForFileDuplicate(
    storageRef: StorageReference,
    tempFileId: string
  ) {
    try {
      await getDownloadURL(storageRef);
      uploadTaskOnError(tempFileId, "File name already exist");
      return true;
    } catch (error: any) {
      return false;
    }
  }

  useEffect(() => {
    getCurrentFolderFiles();
  }, [currentFolder]);

  // function get currentFolder files
  async function getCurrentFolderFiles() {
    if (!user?.uid || !currentFolder?.id) return;
    // if data is in cache return the cached data
    if (files[currentFolder.id]) return;
    //else fetch the data
    setFetchingFiles(true);
    const q = query(
      dbCollectionRefs.files,
      where("userId", "==", user.uid),
      where("parentId", "==", currentFolder.id),
      orderBy("uploadedAt")
    );
    try {
      const snapshot = await getDocs(q);
      const currentFolderFiles = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as FileModel;
      });
      setFiles((prevFiles) => {
        return { ...prevFiles, [currentFolder.id]: currentFolderFiles };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetchingFiles(false);
    }
  }

  function removeFileOnError(fileId: string) {
    setFilesState((prevState) =>
      prevState.filter((file) => file.fileId !== fileId)
    );
  }
  //reset data on logout/leaving browser
  useEffect(() => {
    return () => {
      setFilesState([]);
      setFiles({});
      dispatch(resetAuthStateOnLogout());
      dispatch(resetFolderStateOnLogout());
    };
  }, []);

  return (
    <FilesContext.Provider
      value={{
        filesState,
        files,
        fetchingFiles,
        handleUploadFiles,
        getCurrentFolderFiles,
        removeFileOnError,
      }}
    >
      <Outlet />
    </FilesContext.Provider>
  );
};

export default FilesProvider;
