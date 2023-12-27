import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FolderModel,
  FolderModelWithoutId,
  Path,
} from "../../../models/FolderModel";
import { auth, db, dbCollectionRefs, storage } from "../../firebaseConfig";
import {
  QuerySnapshot,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FileModel } from "../../../models/FileModel";
import { ROOT_FOLDER } from "./foldersSlice";

class FoldersThunks {
  private async getFolderChildren(folder: FolderModel) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in!");
    const userId = user.uid;
    const q = query(
      dbCollectionRefs.folders,
      where("userId", "==", userId),
      where("parentId", "==", folder.id),
      orderBy("createdAt")
    );
    const querySnapshot = await getDocs(q);
    return {
      ...folder,
      children: querySnapshot.docs.map((doc) => ({
        ...(doc.data() as FolderModel),
        id: doc.id,
      })),
    };
  }
  createFolderAsync = createAsyncThunk(
    "files/createFolderAsync",
    async (folder: FolderModelWithoutId) => {
      const newDoc: FolderModelWithoutId = {
        ...folder,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(dbCollectionRefs.folders, newDoc);
      return { ...newDoc, id: docRef.id };
    }
  );

  getFolderChildrenAsync = createAsyncThunk(
    "files/getFolderChildrenAsync",
    async (folder: FolderModel) => {
      return await this.getFolderChildren(folder);
    }
  );

  getFolderAsync = createAsyncThunk(
    "files/getFolderChildrenAsync",
    async (folderId: string) => {
      const docRef = dbCollectionRefs.folersDocRef(folderId);
      const querySnapshot = await getDoc(docRef);
      if (!querySnapshot.exists()) throw new Error("Not Found.");
      const data = querySnapshot.data() as FolderModel;
      const folder = { ...data, id: querySnapshot.id };
      return await this.getFolderChildren(folder);
    }
  );

  renameFolderAsync = createAsyncThunk(
    "files/renameFolderAsync",
    async ({ folder, newName }: { folder: FolderModel; newName: string }) => {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in!");
      const { id, name } = folder;

      const folderRef = dbCollectionRefs.folersDocRef(id);
      const rename: Partial<FolderModel> = { name: newName };
      await updateDoc(folderRef, rename);
      const pathToSearch: Path = { id, name };

      const querySnapshot = await queryFoldersBasedOnPath(
        dbCollectionRefs.folders,
        pathToSearch,
        user.uid
      );

      if (!querySnapshot.empty) {
        let batch = writeBatch(db);
        let docCounter = 0;

        for (const doc of querySnapshot.docs) {
          let docNewPath = (doc.data() as FolderModel).path;

          docNewPath = docNewPath.map((path) => {
            if (path.id !== id) return path;
            return { ...path, name: newName };
          });

          batch.update(doc.ref, { path: docNewPath });

          docCounter++;

          if (docCounter === 499) {
            docCounter = 0;
            await batch.commit();
            batch = writeBatch(db);
          }
        }
        //check if last round was less than 500 then commit batch
        if (docCounter > 0) {
          await batch.commit();
        }
      }
      return { ...folder, name: newName };
    }
  );

  deleteFolderAsync = createAsyncThunk(
    "files/deleteFolderAsync",
    (folder: FolderModel) => deleteFolderWithChildren(folder)
  );
}

export const foldersThunks = new FoldersThunks();

export async function deleteFolderWithChildren(folder: FolderModel) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in!");

  const { id, name } = folder;
  const isRootFolder = id === ROOT_FOLDER.id;

  const folderPathToSearch: Path = { id, name };

  const queryFoldersSnapshot = await queryFoldersBasedOnPath(
    dbCollectionRefs.folders,
    folderPathToSearch,
    user.uid
  );

  !isRootFolder && (await deleteDoc(dbCollectionRefs.folersDocRef(id)));
  const deletedFolders = await deleteDocsBasedOnPath(queryFoldersSnapshot);

  const queryFilesSnapshot = await queryFoldersBasedOnPath(
    dbCollectionRefs.files,
    { id },
    user.uid
  );

  await deleteDocsBasedOnPath(queryFilesSnapshot, true);

  !isRootFolder && deletedFolders.push(folder);
  return { deletedFolders, contextFolder: folder };
}

async function queryFoldersBasedOnPath(
  collection: typeof dbCollectionRefs.folders,
  path: Path | { id: string },
  userId: string
) {
  const q = query(
    collection,
    where("path", "array-contains", path),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot;
}

async function deleteDocsBasedOnPath(
  querySnapshot: QuerySnapshot,
  removeFilesFromStorage?: boolean
) {
  const docsDeletedArr: FolderModel[] = [];

  if (!querySnapshot.empty) {
    let batch = writeBatch(db);
    let docCounter = 0;

    for (const doc of querySnapshot.docs) {
      if (removeFilesFromStorage) {
        const fileUrl = (doc.data() as FileModel).url;
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
      }
      batch.delete(doc.ref);
      docCounter++;

      docsDeletedArr.push({ ...doc.data(), id: doc.id } as FolderModel);
      if (docCounter === 499) {
        docCounter = 0;
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    //check if last round was less than 500 then commit batch
    if (docCounter > 0) {
      await batch.commit();
    }
  }
  return docsDeletedArr;
}
