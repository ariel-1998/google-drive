import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../utils/redux/store";
import {
  StorageError,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  updateMetadata,
  uploadBytesResumable,
} from "firebase/storage";
import { dbCollectionRefs, storage } from "../utils/firebaseConfig";
import { v4 as uuidV4 } from "uuid";
import {
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { FileModel } from "../models/FileModel";
import { Outlet } from "react-router-dom";
import useStorageError from "../hooks/useStorageError";
import { toastService } from "../services/toastService";
import useFirestoreError from "../hooks/useFirestoreError";
import { SerializedError } from "@reduxjs/toolkit";

type FilesContextProps = {
  filesState: FileState[];
  files: FilesCache;
  fetchingFiles: boolean;
  showUploads: boolean;
  toggleShowUploads(): void;
  handleUploadFiles: (file: File) => void;
  getCurrentFolderFiles(): Promise<void>;
  removeFileOnError(fileId: string): void;
  fileDisplayed: FileDisplayed;
  setDisplayedFile: (file: FileDisplayed) => void;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  deleteFile: (file: FileModel) => Promise<void>;
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
  status: "Running" | "Paused" | "Canceled";
  error: boolean;
  errorMsg: string | null;
  uploadTask?: UploadTask;
};

export type FileDisplayOptions = "delete" | "rename" | "details";
type FilesCache = Record<string, FileModel[]>;
type FileDisplayed = {
  file: FileModel;
  option: FileDisplayOptions;
} | null;

const FilesProvider: React.FC = () => {
  const { path, currentFolder } = useSelector(
    (state: RootState) => state.folders
  );
  const storageErrorHandler = useStorageError();

  const { user } = useSelector((state: RootState) => state.user);
  const [filesState, setFilesState] = useState<FileState[]>([]);
  const [files, setFiles] = useState<FilesCache>({});
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const [firestoreError, setFirestoreError] = useState<SerializedError | null>(
    null
  );
  useFirestoreError(firestoreError);
  const [showUploads, setShowUploads] = useState(true);
  const [fileDisplayed, setFileDisplayed] = useState<FileDisplayed>(null);

  //reset data on logout/leaving browser
  useEffect(() => {
    return () => {
      setFilesState([]);
      setFiles({});
    };
  }, []);

  const setDisplayedFile = (file: FileDisplayed) => setFileDisplayed(file);

  const toggleShowUploads = () => {
    setShowUploads((prev) => !prev);
  };

  const handleUploadFiles = async (file: File) => {
    if (!path || !user?.uid) return;
    const filePath = `${path.map((p) => p.id).join("/")}/${file.name}`;

    const storageRef = ref(storage, filePath);
    const tempFileId = uuidV4();

    const newFileState: FileState = {
      fileName: file.name,
      error: false,
      status: "Running",
      uploadProgress: 0,
      fileId: tempFileId,
      errorMsg: null,
    };

    //check for file duplicates
    const fileDuplicate = await checkForFileDuplicate(storageRef);
    if (fileDuplicate) {
      const errorFile: FileState = {
        ...newFileState,
        status: "Canceled",
        error: true,
        errorMsg: "File already exist.",
      };
      setFilesState((prevState) => [...prevState, errorFile]);
      return;
    }
    if (!showUploads) setShowUploads(true);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      customMetadata: { userId: user.uid },
    });
    setFilesState((prevState) => [
      ...prevState,
      { ...newFileState, uploadTask },
    ]);

    uploadTask.on(
      "state_changed",
      (snapshot) => uploadTaskOnStateChange(snapshot, tempFileId),
      (error) => {
        // Handle unsuccessful uploads
        const currentTask = filesState.find(
          (file) => file.fileId === tempFileId
        );
        if (currentTask?.status === "Canceled") {
          storageErrorHandler(error);
        }
        uploadTaskOnError(tempFileId);
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
              return { ...file, status: "Paused" };
            }
            return file;
          })
        );
        break;
      case "running":
        setFilesState((prevState) =>
          prevState.map((file) => {
            if (file.fileId === tempFileId) {
              return { ...file, status: "Running" };
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

      try {
        const uploadedFile = await addDoc(dbCollectionRefs.files, fileObj);
        const fileWithId: FileModel = {
          ...fileObj,
          id: uploadedFile.id,
          uploadedAt: new Date(),
        };
        // checking if there is an array in cache
        // if there is then we add the new file to it right away
        // if there is no cache then dont store it at all (we will bring it with all the files)
        setFiles((prevFiles) => {
          const currentFolderId = path[path.length - 1].id;
          if (prevFiles[currentFolderId]) {
            return {
              ...prevFiles,
              [currentFolderId]: [...prevFiles[currentFolderId], fileWithId],
            };
          }
          return prevFiles;
        });
        setFilesState((prevState) => {
          return prevState.filter((file) => file.fileId !== tempFileId);
        });
      } catch (error) {
        uploadTaskOnError(tempFileId);
        setFirestoreError(error as SerializedError);
      }
    } catch (error) {
      storageErrorHandler(error as StorageError);
      uploadTaskOnError(tempFileId);
    }
  }

  function uploadTaskOnError(tempFileId: string, errorMsg = "") {
    setFilesState((prevState) =>
      prevState.map((file) => {
        if (file.fileId === tempFileId) {
          return { ...file, error: true, status: "Canceled", errorMsg };
        }
        return file;
      })
    );
  }

  async function checkForFileDuplicate(storageRef: StorageReference) {
    try {
      await getDownloadURL(storageRef);
      toastService.info("File already Exist.");
      return true;
    } catch (error) {
      return false;
    }
  }

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
      setFirestoreError(error as SerializedError);
    } finally {
      setFetchingFiles(false);
    }
  }

  function removeFileOnError(fileId: string) {
    setFilesState((prevState) =>
      prevState.filter((file) => file.fileId !== fileId)
    );
  }

  const renameFile = async (fileId: string, newName: string) => {
    if (!currentFolder) return;
    let preveName = "";
    try {
      const fileRef = dbCollectionRefs.fileDocRef(fileId);
      const rename: Partial<FileModel> = { name: newName };
      setFiles((prevFiles) => {
        return {
          ...prevFiles,
          [currentFolder.id]: prevFiles[currentFolder.id].map((file) => {
            if (file.id !== fileId) return file;
            preveName = file.name;
            return { ...file, name: newName };
          }),
        };
      });
      await updateDoc(fileRef, rename);
    } catch (error) {
      setFiles((prevFiles) => {
        return {
          ...prevFiles,
          [currentFolder.id]: prevFiles[currentFolder.id].map((file) => {
            if (file.id !== fileId) return file;
            return { ...file, name: preveName };
          }),
        };
      });
      throw error;
    }
  };

  const deleteFile = async (file: FileModel) => {
    if (!currentFolder) return;
    const fileRef = ref(storage, file.url);
    const fileDoc = dbCollectionRefs.fileDocRef(file.id!);
    try {
      setFiles((prevFiles) => {
        return {
          ...prevFiles,
          [currentFolder.id]: prevFiles[currentFolder.id].filter(
            (currentFile) => currentFile.id !== file.id
          ),
        };
      });
      await deleteObject(fileRef);
      await deleteDoc(fileDoc);
    } catch (error) {
      // set file to what they were before the filtering
      setFiles(files);
      throw error;
    }
  };

  return (
    <FilesContext.Provider
      value={{
        filesState,
        files,
        fetchingFiles,
        handleUploadFiles,
        getCurrentFolderFiles,
        removeFileOnError,
        showUploads,
        toggleShowUploads,
        fileDisplayed,
        setDisplayedFile,
        renameFile,
        deleteFile,
      }}
    >
      <Outlet />
    </FilesContext.Provider>
  );
};

export default FilesProvider;
