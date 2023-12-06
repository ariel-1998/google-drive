import { createAsyncThunk } from "@reduxjs/toolkit";
import { FolderModel, FolderModelWithoutId } from "../../../models/FolderModel";
import { auth, dbCollectionRefs } from "../../firebaseConfig";
import {
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { store } from "../store";

class FoldersThunks {
  private async getFolderChildren(folder: FolderModel) {
    const userId = auth.currentUser?.uid;

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
      const { id } = folder;
      const folderRef = dbCollectionRefs.folersDocRef(id);
      const rename: Partial<FolderModel> = { name: newName };
      await updateDoc(folderRef, rename);
      return { ...folder, name: newName };
    }
  );

  // deleteFolder = createAsyncThunk(
  //   "files/getFolderChildrenAsync",
  //   async (folder: FolderModel) => {
  //     const userId = store.getState().user.user?.uid;
  //     //check if folder is cached before requesting with an api call
  //     const { folders, currentFolder } = store.getState().folders;
  //     const cachedFolder = folders[folder.id];
  //     if (cachedFolder && currentFolder) return cachedFolder;
  //     //if not exist then we query the folder children
  //     const q = query(
  //       dbCollectionRefs.folders,
  //       where("userId", "==", userId),
  //       where("parentId", "==", folder.id || "null"),
  //       orderBy("createdAt")
  //     );
  //     const querySnapshot = await getDocs(q);
  //     return {
  //       ...folder,
  //       children: querySnapshot.docs.map((doc) => ({
  //         ...(doc.data() as FolderModel),
  //         id: doc.id,
  //       })),
  //     };
  //   }
  // );
}

export const foldersThunks = new FoldersThunks();
