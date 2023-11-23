import { createAsyncThunk } from "@reduxjs/toolkit";
import { FolderModel, FolderModelWithoutId } from "../../../models/FolderModel";
import { dbCollectionRefs } from "../../firebaseConfig";
import {
  addDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { store } from "../store";

class FoldersThunks {
  private async getFolderChildren(folder: FolderModel) {
    const userId = store.getState().user.user?.uid;

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
      //i might add function that if there is no uid the logout the user with message token expired
      const userId = store.getState().user.user?.uid;

      const docRef = dbCollectionRefs.folersDocRef(folderId);

      const querySnapshot = await getDoc(docRef);
      if (!querySnapshot.exists()) throw new Error();

      const data = querySnapshot.data() as FolderModel;
      if (data.userId !== userId) throw new Error();
      const folder = { ...data, id: querySnapshot.id };
      return await this.getFolderChildren(folder);
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
