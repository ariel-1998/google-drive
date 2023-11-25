import React, { ReactNode, createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../utils/redux/store";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { dbCollectionRefs, storage } from "../utils/firebaseConfig";
import { v4 as uuidV4 } from "uuid";
import { addDoc } from "firebase/firestore";
import { FileModel } from "../models/FileModel";

type FilesContextProps = {};

const FilesContext = createContext<FilesContextProps | null>(null);

const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) throw new Error("useFiles must be used inside FilesProvider.");
  return context;
};
type FilesProviderProps = {
  children: ReactNode;
};

type FileState = {
  fileId: string;
  fileName: string;
  uploadProgress: number;
  status: "running" | "paused" | "canceled";
  error: boolean;
};

type FilesCache = Record<string, FileModel[]>;

const FilesProvider: React.FC<FilesProviderProps> = ({ children }) => {
  const { currentFolder } = useSelector((state: RootState) => state.folders);
  const { user } = useSelector((state: RootState) => state.user);
  const [filesState, setFilesState] = useState<FileState[]>([]);
  const [files, setFiles] = useState<FilesCache>({});

  const handleUploadFiles = (file: File) => {
    if (!currentFolder || user?.uid) return;
    const { path } = currentFolder;
    const filePath = `${path.join("/")}/${file.name}`;
    const storageRef = ref(storage, filePath);

    const tempFileId = uuidV4();

    const newFileState: FileState = {
      fileName: file.name,
      error: false,
      status: "running",
      uploadProgress: 0,
      fileId: tempFileId,
    };

    setFilesState((prevState) => [...prevState, newFileState]);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      async () => {
        // Handle successful uploads on complete
        const donloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        const fileObj: FileModel = {
          name: file.name,
          parentId: currentFolder.id,
          userId: user?.uid,
          url: donloadUrl,
        };
        const uploadedFile = await addDoc(dbCollectionRefs.files, fileObj);

        const fileWithId = { ...fileObj, id: uploadedFile.id };
        if (files[currentFolder.id]) {
          return (files[currentFolder.id] = [
            ...files[currentFolder.id],
            fileWithId,
          ]);
        }
        files[currentFolder.id] = [fileWithId];
      }
    );
  };

  return <FilesContext.Provider value={{}}>{children}</FilesContext.Provider>;
};

export default FilesProvider;
